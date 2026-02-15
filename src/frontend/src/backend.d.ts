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
export interface backendInterface {
    create(personId: string, payload: Data): Promise<Data>;
    delete_(personId: string): Promise<void>;
    listAll(): Promise<Array<Data>>;
    read(personId: string): Promise<Data>;
    update(personId: string, payload: Data): Promise<Data>;
}
