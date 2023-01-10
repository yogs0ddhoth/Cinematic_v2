
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface User {
    id: string;
    email: string;
}

export interface Auth {
    access_token: string;
}

export interface IMutation {
    signup(email: string, password: string): Auth | Promise<Auth>;
    login(email: string, password: string): Auth | Promise<Auth>;
}

type Nullable<T> = T | null;
