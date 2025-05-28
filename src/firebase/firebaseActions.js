import { db } from './firebaseConfig';
import { ref, set, onValue, off, update } from "firebase/database";

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