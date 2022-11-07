## Usher Mobile

Alpha build for mobile research framework, providing transparent access
to location and accelerometer data for research purposes.

From the ground-up the application is built to very transparently show
all data that is being gathered and sent to a remote endpoint.

Application contact: [ronald@rmacd.com](mailto:ronald@rmacd.com).

License: GNU GPL v3.0

## Build and run

To build and run the app itself, you must first specify the API endpoint
in `.env` (see `.env.template` for example settings). Afterwards, you can
run the `ios` or `android` goals:

```
npm run ios
```

Assuming your backend service is up and running, you should be able to
set up test projects and enrol/unenrol in these projects via the app.
