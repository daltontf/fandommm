## fandomMM/axum

This is an Axum server for to provide a REST API for the rust_calc functionality. 
To run the server, you will need to have Rust installed. You can then run the following command in the root directory of the project:

```bash
cargo run
```

There is an optional parameter that allows the Axum server to server the React application from the ```/web``` directory. 

```
cargo run -- ../react_interactive/web/dist/
```

Navigate to ```http://localhost:3000``` in your browser to see the React application. The React application will make requests to the Axum server for the rust_calc functionality. Provide the ```/web/dist/``` is built using the the default ```.env``` file.