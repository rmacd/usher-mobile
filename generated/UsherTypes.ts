/* tslint:disable */
/* eslint-disable */

export interface PreEnrolmentRequest {
    pin?: string;
}

export interface PreEnrolmentResponse {
    projectName?: string;
    requiredPermissions?: ProjectPermissions[];
    projectDescription?: string;
    projectTerms?: string;
    termsUpdated?: string;
}

export interface EnrolmentResponse {
}

export interface AuthResponse {
    csrf?: string;
    issued?: Date;
}

export interface GenericError {
    status?: HttpStatus;
    message?: string;
    errors?: string[];
    timestamp?: string;
}

export interface PermissionDTO {
    name?: string;
    description?: string;
}

export enum ProjectPermissions {
    ACCELEROMETER_FOREGROUND = "ACCELEROMETER_FOREGROUND",
    ACCELEROMETER_BACKGROUND = "ACCELEROMETER_BACKGROUND",
    GPS_FOREGROUND = "GPS_FOREGROUND",
    GPS_BACKGROUND = "GPS_BACKGROUND",
    DEVICE_ID = "DEVICE_ID",
    USER_IP = "USER_IP",
    CAMERA = "CAMERA",
    AUDIO = "AUDIO",
}

export enum HttpStatus {
    CONTINUE = "CONTINUE",
    SWITCHING_PROTOCOLS = "SWITCHING_PROTOCOLS",
    PROCESSING = "PROCESSING",
    CHECKPOINT = "CHECKPOINT",
    OK = "OK",
    CREATED = "CREATED",
    ACCEPTED = "ACCEPTED",
    NON_AUTHORITATIVE_INFORMATION = "NON_AUTHORITATIVE_INFORMATION",
    NO_CONTENT = "NO_CONTENT",
    RESET_CONTENT = "RESET_CONTENT",
    PARTIAL_CONTENT = "PARTIAL_CONTENT",
    MULTI_STATUS = "MULTI_STATUS",
    ALREADY_REPORTED = "ALREADY_REPORTED",
    IM_USED = "IM_USED",
    MULTIPLE_CHOICES = "MULTIPLE_CHOICES",
    MOVED_PERMANENTLY = "MOVED_PERMANENTLY",
    FOUND = "FOUND",
    MOVED_TEMPORARILY = "MOVED_TEMPORARILY",
    SEE_OTHER = "SEE_OTHER",
    NOT_MODIFIED = "NOT_MODIFIED",
    USE_PROXY = "USE_PROXY",
    TEMPORARY_REDIRECT = "TEMPORARY_REDIRECT",
    PERMANENT_REDIRECT = "PERMANENT_REDIRECT",
    BAD_REQUEST = "BAD_REQUEST",
    UNAUTHORIZED = "UNAUTHORIZED",
    PAYMENT_REQUIRED = "PAYMENT_REQUIRED",
    FORBIDDEN = "FORBIDDEN",
    NOT_FOUND = "NOT_FOUND",
    METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED",
    NOT_ACCEPTABLE = "NOT_ACCEPTABLE",
    PROXY_AUTHENTICATION_REQUIRED = "PROXY_AUTHENTICATION_REQUIRED",
    REQUEST_TIMEOUT = "REQUEST_TIMEOUT",
    CONFLICT = "CONFLICT",
    GONE = "GONE",
    LENGTH_REQUIRED = "LENGTH_REQUIRED",
    PRECONDITION_FAILED = "PRECONDITION_FAILED",
    PAYLOAD_TOO_LARGE = "PAYLOAD_TOO_LARGE",
    REQUEST_ENTITY_TOO_LARGE = "REQUEST_ENTITY_TOO_LARGE",
    URI_TOO_LONG = "URI_TOO_LONG",
    REQUEST_URI_TOO_LONG = "REQUEST_URI_TOO_LONG",
    UNSUPPORTED_MEDIA_TYPE = "UNSUPPORTED_MEDIA_TYPE",
    REQUESTED_RANGE_NOT_SATISFIABLE = "REQUESTED_RANGE_NOT_SATISFIABLE",
    EXPECTATION_FAILED = "EXPECTATION_FAILED",
    I_AM_A_TEAPOT = "I_AM_A_TEAPOT",
    INSUFFICIENT_SPACE_ON_RESOURCE = "INSUFFICIENT_SPACE_ON_RESOURCE",
    METHOD_FAILURE = "METHOD_FAILURE",
    DESTINATION_LOCKED = "DESTINATION_LOCKED",
    UNPROCESSABLE_ENTITY = "UNPROCESSABLE_ENTITY",
    LOCKED = "LOCKED",
    FAILED_DEPENDENCY = "FAILED_DEPENDENCY",
    TOO_EARLY = "TOO_EARLY",
    UPGRADE_REQUIRED = "UPGRADE_REQUIRED",
    PRECONDITION_REQUIRED = "PRECONDITION_REQUIRED",
    TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",
    REQUEST_HEADER_FIELDS_TOO_LARGE = "REQUEST_HEADER_FIELDS_TOO_LARGE",
    UNAVAILABLE_FOR_LEGAL_REASONS = "UNAVAILABLE_FOR_LEGAL_REASONS",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
    BAD_GATEWAY = "BAD_GATEWAY",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
    GATEWAY_TIMEOUT = "GATEWAY_TIMEOUT",
    HTTP_VERSION_NOT_SUPPORTED = "HTTP_VERSION_NOT_SUPPORTED",
    VARIANT_ALSO_NEGOTIATES = "VARIANT_ALSO_NEGOTIATES",
    INSUFFICIENT_STORAGE = "INSUFFICIENT_STORAGE",
    LOOP_DETECTED = "LOOP_DETECTED",
    BANDWIDTH_LIMIT_EXCEEDED = "BANDWIDTH_LIMIT_EXCEEDED",
    NOT_EXTENDED = "NOT_EXTENDED",
    NETWORK_AUTHENTICATION_REQUIRED = "NETWORK_AUTHENTICATION_REQUIRED",
}
