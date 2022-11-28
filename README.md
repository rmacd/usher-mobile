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

### Permissions

The following permissions are required on devices

| **iOS permission name**                      | **Description**                                                                                                                     |
|----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| NSHealthShareUsageDescription                | Access to health sensors is required in order to identify motion and query data from wearables, if available.                       |
| NSHealthUpdateUsageDescription               | Access to update health data is required so that any recorded sensor data can be retrieved later.                                   |
| NSLocationAlwaysAndWhenInUseUsageDescription | Background access to the GPS is required so that location data can be collected even if the app is not in the foreground.           |
| NSLocationWhenInUseUsageDescription          | The platform requires access to your location data and, with your permission, will forward this data to specific research projects. |
| NSMotionUsageDescription                     | Access to motion sensors is required in order to determine the type of movements (running, walking, etc) you are undertaking.       |
