/* tslint:disable */
/* eslint-disable */

export interface PreEnrollmentRequest {
    pin?: string;
}

export interface PreEnrollmentResponse {
    requiredPermissions?: ProjectPermissions[];
    projectDescription?: string;
    projectTerms?: string;
    termsUpdated?: string;
}

export interface EnrollmentResponse {
}

export interface AuthResponse {
    csrf?: string;
    issued?: Date;
}

export enum ProjectPermissions {
    GPS_FOREGROUND = "GPS_FOREGROUND",
    GPS_BACKGROUND = "GPS_BACKGROUND",
    DEVICE_ID = "DEVICE_ID",
    ACCELEROMETER_FOREGROUND = "ACCELEROMETER_FOREGROUND",
    ACCELEROMETER_BACKGROUND = "ACCELEROMETER_BACKGROUND",
    USER_IP = "USER_IP",
    CAMERA = "CAMERA",
    AUDIO = "AUDIO",
}
