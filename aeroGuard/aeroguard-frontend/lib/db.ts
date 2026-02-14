import { DBSchema, openDB } from "idb";
import { type Unit } from "./schema";

interface AeroGuard extends DBSchema{
    units:{
        key : string;
        value : Unit
    }
}

const DB_NAME = 'aeroguard-db';
const STORE_NAME = 'units';

export async function initDB() {
    return openDB<AeroGuard>(DB_NAME , 1 , {
        upgrade(db){
            if(!db.objectStoreNames.contains(STORE_NAME)){
                db.createObjectStore(STORE_NAME , {keyPath: 'unit_id'});
            }
        }
    });
}

export async function saveUnitToDB(unit : Unit){
    const db = await initDB()
    await db.put(STORE_NAME , unit);
}

export async function getAllUnitsFromDB(): Promise<Unit[]>{
    const db = await initDB();
    return await db.getAll(STORE_NAME)
}