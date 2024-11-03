import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import ThemedText from '@/components/ThemedText';
import { FIRESTORE_DB } from '@/utils/FirebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';

interface PlayerScore {
  id: string;
  username: string;
  totalPoints: number;
  wins: number;
  currentStreak: number;
}

const Leaderboard = () => {
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const highscoresRef = collection(FIRESTORE_DB, 'highscores');
      const q = query(highscoresRef, orderBy('totalPoints', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const leaderboardData: PlayerScore[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        leaderboardData.push({
          id: doc.id,
          username: doc.id === user?.id ? 'Tú' : `Jugador ${leaderboardData.length + 1}`,
          totalPoints: data.totalPoints || 0,
          wins: data.wins || 0,
          currentStreak: data.currentStreak || 0,
        });
      });
      
      setScores(leaderboardData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: PlayerScore; index: number }) => {
    const isCurrentUser = item.id === user?.id;
    const position = index + 1;
    let medalColor = '';
    
    if (position === 1) medalColor = '#FFD700'; // Gold
    else if (position === 2) medalColor = '#C0C0C0'; // Silver
    else if (position === 3) medalColor = '#CD7F32'; // Bronze

    return (
      <View style={[
        styles.scoreItem,
        isCurrentUser && styles.currentUserItem
      ]}>
        <View style={styles.positionContainer}>
          {position <= 3 ? (
            <Ionicons name="medal" size={24} color={medalColor} />
          ) : (
            <ThemedText style={styles.position}>{position}</ThemedText>
          )}
        </View>
        
        <View style={styles.playerInfo}>
          <ThemedText style={styles.username}>{item.username}</ThemedText>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <ThemedText style={styles.statValue}>{item.totalPoints}</ThemedText>
              <ThemedText style={styles.statLabel}>Puntos</ThemedText>
            </View>
            <View style={styles.stat}>
              <ThemedText style={styles.statValue}>{item.wins}</ThemedText>
              <ThemedText style={styles.statLabel}>Victorias</ThemedText>
            </View>
            <View style={styles.stat}>
              <ThemedText style={styles.statValue}>{item.currentStreak}</ThemedText>
              <ThemedText style={styles.statLabel}>Racha</ThemedText>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={scores}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 16,
  },
  scoreItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    alignItems: 'center',
  },
  currentUserItem: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  positionContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  position: {
    fontSize: 18,
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
  },
  playerInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'FrankRuhlLibre_800ExtraBold',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
});