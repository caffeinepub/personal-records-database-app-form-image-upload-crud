import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Data {
    weight?: bigint;
    height?: bigint;
    hobby?: string;
    dateOfBirth: string;
    city?: string;
    name: string;
    education?: string;
    mobileNumber: string;
    image?: ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    create(personId: string, payload: Data): Promise<Data>;
    createPersonalRecord(payload: Data): Promise<Data>;
    delete_(personId: string): Promise<void>;
    deletePersonalRecord(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPersonalRecordByUser(user: Principal): Promise<Data | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllAdmin(): Promise<Array<Data>>;
    readAdmin(personId: string): Promise<Data>;
    readPersonalRecord(): Promise<Data | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    update(personId: string, payload: Data): Promise<Data>;
    updatePersonalRecord(payload: Data): Promise<Data>;
}
