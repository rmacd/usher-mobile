/* tslint:disable */
/* eslint-disable */

export interface AESPayload {
    key?: string;
    iv?: string;
    payload?: string;
}

export interface GenericError {
    status?: HttpStatus;
    message?: string;
    errors?: string[];
    timestamp?: string;
}

export interface AuthResponse {
    csrf?: string;
    issued?: Date;
}

export interface ConfirmEnrolmentRequest {
    projectId?: string;
    participantId?: string;
    publicKey?: string;
    signature?: string;
}

export interface ConfirmEnrolmentResponse {
    projectId?: string;
    publicKey?: string;
    requiredPermissions?: ProjectPermission[];
}

export interface MobileLocationEvent {
    eventId?: string;
    batteryCharging?: boolean;
    batteryLevel?: number;
    latitude?: number;
    longitude?: number;
    speed?: number;
    heading?: number;
    altitude?: number;
    locationAccuracy?: number;
    speedAccuracy?: number;
    headingAccuracy?: number;
    altitudeAccuracy?: number;
    activity?: string;
    activityAccuracy?: number;
    moving?: boolean;
    mock?: boolean;
    timestamp?: Date;
}

export interface PermissionDTO {
    name?: string;
    description?: string;
}

export interface PreEnrolmentRequest {
    pin?: string;
}

export interface PreEnrolmentResponse {
    projectName?: string;
    projectId?: string;
    requiredPermissions?: ProjectPermission[];
    projectDescription?: string;
    projectTerms?: string;
    termsUpdated?: string;
    participantId?: string;
    signature?: string;
}

export interface ProjectDTO {
}

export interface ResponseWrapper {
    type?: string;
    value?: any;
}

/**
 * Values:
 * - `100 CONTINUE`
 * - `101 SWITCHING_PROTOCOLS`
 * - `102 PROCESSING`
 * - `103 CHECKPOINT`
 * - `200 OK`
 * - `201 CREATED`
 * - `202 ACCEPTED`
 * - `203 NON_AUTHORITATIVE_INFORMATION`
 * - `204 NO_CONTENT`
 * - `205 RESET_CONTENT`
 * - `206 PARTIAL_CONTENT`
 * - `207 MULTI_STATUS`
 * - `208 ALREADY_REPORTED`
 * - `226 IM_USED`
 * - `300 MULTIPLE_CHOICES`
 * - `301 MOVED_PERMANENTLY`
 * - `302 FOUND`
 * - `302 MOVED_TEMPORARILY` - @deprecated
 * - `303 SEE_OTHER`
 * - `304 NOT_MODIFIED`
 * - `305 USE_PROXY` - @deprecated
 * - `307 TEMPORARY_REDIRECT`
 * - `308 PERMANENT_REDIRECT`
 * - `400 BAD_REQUEST`
 * - `401 UNAUTHORIZED`
 * - `402 PAYMENT_REQUIRED`
 * - `403 FORBIDDEN`
 * - `404 NOT_FOUND`
 * - `405 METHOD_NOT_ALLOWED`
 * - `406 NOT_ACCEPTABLE`
 * - `407 PROXY_AUTHENTICATION_REQUIRED`
 * - `408 REQUEST_TIMEOUT`
 * - `409 CONFLICT`
 * - `410 GONE`
 * - `411 LENGTH_REQUIRED`
 * - `412 PRECONDITION_FAILED`
 * - `413 PAYLOAD_TOO_LARGE`
 * - `413 REQUEST_ENTITY_TOO_LARGE` - @deprecated
 * - `414 URI_TOO_LONG`
 * - `414 REQUEST_URI_TOO_LONG` - @deprecated
 * - `415 UNSUPPORTED_MEDIA_TYPE`
 * - `416 REQUESTED_RANGE_NOT_SATISFIABLE`
 * - `417 EXPECTATION_FAILED`
 * - `418 I_AM_A_TEAPOT`
 * - `419 INSUFFICIENT_SPACE_ON_RESOURCE` - @deprecated
 * - `420 METHOD_FAILURE` - @deprecated
 * - `421 DESTINATION_LOCKED` - @deprecated
 * - `422 UNPROCESSABLE_ENTITY`
 * - `423 LOCKED`
 * - `424 FAILED_DEPENDENCY`
 * - `425 TOO_EARLY`
 * - `426 UPGRADE_REQUIRED`
 * - `428 PRECONDITION_REQUIRED`
 * - `429 TOO_MANY_REQUESTS`
 * - `431 REQUEST_HEADER_FIELDS_TOO_LARGE`
 * - `451 UNAVAILABLE_FOR_LEGAL_REASONS`
 * - `500 INTERNAL_SERVER_ERROR`
 * - `501 NOT_IMPLEMENTED`
 * - `502 BAD_GATEWAY`
 * - `503 SERVICE_UNAVAILABLE`
 * - `504 GATEWAY_TIMEOUT`
 * - `505 HTTP_VERSION_NOT_SUPPORTED`
 * - `506 VARIANT_ALSO_NEGOTIATES`
 * - `507 INSUFFICIENT_STORAGE`
 * - `508 LOOP_DETECTED`
 * - `509 BANDWIDTH_LIMIT_EXCEEDED`
 * - `510 NOT_EXTENDED`
 * - `511 NETWORK_AUTHENTICATION_REQUIRED`
 */
export enum HttpStatus {
    CONTINUE = "100 CONTINUE",
    SWITCHING_PROTOCOLS = "101 SWITCHING_PROTOCOLS",
    PROCESSING = "102 PROCESSING",
    CHECKPOINT = "103 CHECKPOINT",
    OK = "200 OK",
    CREATED = "201 CREATED",
    ACCEPTED = "202 ACCEPTED",
    NON_AUTHORITATIVE_INFORMATION = "203 NON_AUTHORITATIVE_INFORMATION",
    NO_CONTENT = "204 NO_CONTENT",
    RESET_CONTENT = "205 RESET_CONTENT",
    PARTIAL_CONTENT = "206 PARTIAL_CONTENT",
    MULTI_STATUS = "207 MULTI_STATUS",
    ALREADY_REPORTED = "208 ALREADY_REPORTED",
    IM_USED = "226 IM_USED",
    MULTIPLE_CHOICES = "300 MULTIPLE_CHOICES",
    MOVED_PERMANENTLY = "301 MOVED_PERMANENTLY",
    FOUND = "302 FOUND",
    /**
     * @deprecated
     */
    MOVED_TEMPORARILY = "302 MOVED_TEMPORARILY",
    SEE_OTHER = "303 SEE_OTHER",
    NOT_MODIFIED = "304 NOT_MODIFIED",
    /**
     * @deprecated
     */
    USE_PROXY = "305 USE_PROXY",
    TEMPORARY_REDIRECT = "307 TEMPORARY_REDIRECT",
    PERMANENT_REDIRECT = "308 PERMANENT_REDIRECT",
    BAD_REQUEST = "400 BAD_REQUEST",
    UNAUTHORIZED = "401 UNAUTHORIZED",
    PAYMENT_REQUIRED = "402 PAYMENT_REQUIRED",
    FORBIDDEN = "403 FORBIDDEN",
    NOT_FOUND = "404 NOT_FOUND",
    METHOD_NOT_ALLOWED = "405 METHOD_NOT_ALLOWED",
    NOT_ACCEPTABLE = "406 NOT_ACCEPTABLE",
    PROXY_AUTHENTICATION_REQUIRED = "407 PROXY_AUTHENTICATION_REQUIRED",
    REQUEST_TIMEOUT = "408 REQUEST_TIMEOUT",
    CONFLICT = "409 CONFLICT",
    GONE = "410 GONE",
    LENGTH_REQUIRED = "411 LENGTH_REQUIRED",
    PRECONDITION_FAILED = "412 PRECONDITION_FAILED",
    PAYLOAD_TOO_LARGE = "413 PAYLOAD_TOO_LARGE",
    /**
     * @deprecated
     */
    REQUEST_ENTITY_TOO_LARGE = "413 REQUEST_ENTITY_TOO_LARGE",
    URI_TOO_LONG = "414 URI_TOO_LONG",
    /**
     * @deprecated
     */
    REQUEST_URI_TOO_LONG = "414 REQUEST_URI_TOO_LONG",
    UNSUPPORTED_MEDIA_TYPE = "415 UNSUPPORTED_MEDIA_TYPE",
    REQUESTED_RANGE_NOT_SATISFIABLE = "416 REQUESTED_RANGE_NOT_SATISFIABLE",
    EXPECTATION_FAILED = "417 EXPECTATION_FAILED",
    I_AM_A_TEAPOT = "418 I_AM_A_TEAPOT",
    /**
     * @deprecated
     */
    INSUFFICIENT_SPACE_ON_RESOURCE = "419 INSUFFICIENT_SPACE_ON_RESOURCE",
    /**
     * @deprecated
     */
    METHOD_FAILURE = "420 METHOD_FAILURE",
    /**
     * @deprecated
     */
    DESTINATION_LOCKED = "421 DESTINATION_LOCKED",
    UNPROCESSABLE_ENTITY = "422 UNPROCESSABLE_ENTITY",
    LOCKED = "423 LOCKED",
    FAILED_DEPENDENCY = "424 FAILED_DEPENDENCY",
    TOO_EARLY = "425 TOO_EARLY",
    UPGRADE_REQUIRED = "426 UPGRADE_REQUIRED",
    PRECONDITION_REQUIRED = "428 PRECONDITION_REQUIRED",
    TOO_MANY_REQUESTS = "429 TOO_MANY_REQUESTS",
    REQUEST_HEADER_FIELDS_TOO_LARGE = "431 REQUEST_HEADER_FIELDS_TOO_LARGE",
    UNAVAILABLE_FOR_LEGAL_REASONS = "451 UNAVAILABLE_FOR_LEGAL_REASONS",
    INTERNAL_SERVER_ERROR = "500 INTERNAL_SERVER_ERROR",
    NOT_IMPLEMENTED = "501 NOT_IMPLEMENTED",
    BAD_GATEWAY = "502 BAD_GATEWAY",
    SERVICE_UNAVAILABLE = "503 SERVICE_UNAVAILABLE",
    GATEWAY_TIMEOUT = "504 GATEWAY_TIMEOUT",
    HTTP_VERSION_NOT_SUPPORTED = "505 HTTP_VERSION_NOT_SUPPORTED",
    VARIANT_ALSO_NEGOTIATES = "506 VARIANT_ALSO_NEGOTIATES",
    INSUFFICIENT_STORAGE = "507 INSUFFICIENT_STORAGE",
    LOOP_DETECTED = "508 LOOP_DETECTED",
    BANDWIDTH_LIMIT_EXCEEDED = "509 BANDWIDTH_LIMIT_EXCEEDED",
    NOT_EXTENDED = "510 NOT_EXTENDED",
    NETWORK_AUTHENTICATION_REQUIRED = "511 NETWORK_AUTHENTICATION_REQUIRED",
}

export enum ProjectPermission {
    ACCELEROMETER_FOREGROUND = "Project requests access to device accelerometer while app is in foreground",
    ACCELEROMETER_BACKGROUND = "Project requests access to device accelerometer while app is in background",
    GPS_FOREGROUND = "Project requests access to GPS (ie your location) while app is in foreground",
    GPS_BACKGROUND = "Project requests access to GPS (ie your location) while app is in background",
    DEVICE_ID = "Project requests that a hash of the device ID be submitted by participant",
    UNIQUE_ID = "Enrolled devices will be given a unique ID; project requests permission to use this ID in any analysis (to join data points together)",
    USER_IP = "Project requests permission to log device IP when submitting participant data",
    CAMERA = "Project requests permission to access camera",
    AUDIO = "Project requests permission to access device audio",
}
