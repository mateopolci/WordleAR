import React, { useEffect, useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import ThemedText from './ThemedText';

interface GameTimerProps {
  startTime: number;
  onTimeExpired: () => void;
}

export default function GameTimer({ startTime, onTimeExpired }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(300);
  const [serverOffset, setServerOffset] = useState(0);

  useEffect(() => {
    const calculateOffset = async () => {
      const serverTime = await fetch('https://worldtimeapi.org/api/ip').then(r => r.json());
      const serverMs = new Date(serverTime.datetime).getTime();
      const offsetMs = serverMs - Date.now();
      setServerOffset(offsetMs);
    };
    calculateOffset();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now() + serverOffset + 5;
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = 305 - elapsed;
      
      if (remaining <= 0) {
        clearInterval(interval);
        Alert.alert(
          'Empate',
          'Ninguno de los jugadores adivinó la palabra en el tiempo límite',
          [{ text: 'Aceptar', onPress: onTimeExpired }]
        );
        return;
      }
      
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, serverOffset]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <ThemedText style={styles.timer}>
      {`${minutes}:${seconds.toString().padStart(2, '0')}`}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 20,
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
  }
});