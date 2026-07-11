use axum::{
    Router,
    routing::post,
    routing::get,
    extract::State,
    extract::Query,
    response::Json,
    http::status::StatusCode,  
    http::Method 
};

use tower_http::cors::{CorsLayer, Any};

use std::sync::Arc;
use std::collections::HashMap;

use rust_calc::{LatLonCoords, League, LeagueStats, LeagueStatsCalculator};

#[tokio::main]
async fn main() {
    let calculator = Arc::new(LeagueStatsCalculator::new_default());
    
    let app = Router::new()
        .route("/", post(calculate_stats_handler))
        .route("/", get(lookup_state_name_by_coordinates))
        .with_state(calculator)
        .layer(CorsLayer::new()
            .allow_origin(Any)
            .allow_methods([
                Method::GET,
                Method::POST,
                Method::OPTIONS,
            ])
            .allow_headers(Any));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();

    println!("Listening on http://localhost:3000");

    axum::serve(listener, app).await.unwrap();
}

async fn calculate_stats_handler(
    State(calculator): State<Arc<LeagueStatsCalculator>>,
    Query(params): Query<HashMap<String, f64>>,
    Json(league): Json<League>,
) -> Json<LeagueStats> {
    Json(calculator.load_league_with_overrides(&league, params))
}

async fn lookup_state_name_by_coordinates(
    State(calculator): State<Arc<LeagueStatsCalculator>>,  
    Query(params): Query<LatLonCoords>,  
) -> Result<String, StatusCode> {
    calculator.lookup_state_name_by_coordinates(params.lat, params.lon)
        .ok_or(StatusCode::NOT_FOUND)
}