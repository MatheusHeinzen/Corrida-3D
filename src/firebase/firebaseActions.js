import { db } from './firebaseConfig';
import { ref, set, onValue, off, update } from "firebase/database";

// Cria/entra em uma sala
export function joinRoom(roomId, playerId, playerData) {
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    set(playerRef, playerData);
}

// Atualiza dados do jogador
export function updatePlayer(roomId, playerId, data) {
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    update(playerRef, data);
}

// Escuta mudanças na sala
export function syncRoom(roomId, callback) {
    const roomRef = ref(db, `rooms/${roomId}`);
    onValue(roomRef, (snapshot) => callback(snapshot.val()));
}

// Sai da sala
export function leaveRoom(roomId, playerId) {
    const playerRef = ref(db, `rooms/${roomId}/players/${playerId}`);
    set(playerRef, null);
}