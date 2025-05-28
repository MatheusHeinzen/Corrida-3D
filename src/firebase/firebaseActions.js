import { db } from './firebaseConfig';
import { ref, set, onValue, off, update } from "firebase/database";
import { getDatabase, remove } from "firebase/database";

export function joinRoom(roomId, playerId, playerData) {
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    set(playerRef, playerData);
}

export function updatePlayer(roomId, playerId, data) {
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    update(playerRef, data);
}

export function syncRoom(roomId, callback) {
    const roomRef = ref(db, `rooms/${roomId}`);
    const unsubscribe = onValue(roomRef, (snapshot) => callback(snapshot.val()));
    return () => off(roomRef);
}

export function leaveRoom(roomId, playerId) {
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    set(playerRef, null);
}

export function createPlayerCar(roomId, playerId, carData) {
    const db = getDatabase();
    const carRef = ref(db, `rooms/${roomId}/cars/${playerId}`);
    set(carRef, carData);
    window.addEventListener("beforeunload", () => remove(carRef));
}

export function listenCars(roomId, callback) {
    const db = getDatabase();
    const carsRef = ref(db, `rooms/${roomId}/cars`);
    onValue(carsRef, (snapshot) => {
        callback(snapshot.val() || {});
    });
}

export function updatePlayerCar(roomId, playerId, carData) {
    const db = getDatabase();
    const carRef = ref(db, `rooms/${roomId}/cars/${playerId}`);
    set(carRef, carData);
}