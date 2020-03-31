import React, { useEffect, useState, useMemo } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  connectAsync,
  getBillingResponseCodeAsync,
  getPurchaseHistoryAsync,
  IAPResponseCode
} from 'expo-in-app-purchases';
import AsyncStorage from '@react-native-community/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { bool, func, number, object, shape, string } from 'prop-types';

import GET_DATA from '../graphql/queries/getHomeData';
import GET_USER_MATCHES from '../graphql/queries/getUserMatches';
import CREATED_MATCH from '../graphql/subscriptions/createdMatch';
import UPDATED_MATCH from '../graphql/subscriptions/updatedMatch';
import UPDATE_MATCH from '../graphql/mutations/updateMatch';
import UPDATE_USER from '../graphql/mutations/updateUser';
import DELETE_MATCH from '../graphql/mutations/deleteMatch';

import {
  togglePlay,
  toggleNetworkModal,
  togglePurchasePopup,
  toggleTerms
} from '../actions/popup';
import { setRefetchUser } from '../actions/user';

import { useDateCountdown } from '../helpers/hooks';

import AnimatedCircle from '../components/AnimatedCircle';
import ProgressBar from '../components/LevelProgressBar';
import MatchRow from '../components/MatchRow';
import FinishedMatchRow from '../components/FinishedMatchRow';
import Loader from '../components/Loader';
import Empty from '../components/Empty';
import FFARow from '../components/FFARow';

import Crown from '../../assets/icons/crown.svg';

import Layout from '../constants/Layout';

const mapDispatchToProps = dispatch => ({
  openPlay: (data = {}) => dispatch(togglePlay(true, data)),
  closeNetworkModal: () => dispatch(toggleNetworkModal(false)),
  openPurchase: () => dispatch(togglePurchasePopup(true)),
  openTerms: data => dispatch(toggleTerms(true, data)),
  didRefetch: () => dispatch(setRefetchUser(false))
});

const mapStateToProps = ({
  popup: { displayNetworkModal },
  user: { refetchUser }
}) => ({
  displayNetworkModal,
  refetchUser
});

dayjs.extend(isBetween);

const Header = ({
  user,
  navigateToSettings,
  openPurchase,
  notificationCount,
  onCountdownEnd
}) => {
  const countdown = user.lifeDate
    ? useDateCountdown(
        dayjs(),
        dayjs(user.lifeDate).add(4, 'h'),
        onCountdownEnd
      )
    : '00:00';
  return (
    <>
      <View style={styles.header}>
        <AnimatedCircle
          color="#7C4DFF"
          size={152}
          animationType="position-opacity"
          endPosition={{ y: 152 - 152 / 4, x: -152 + 152 / 3 }}
          circleStyle={{ right: -152, top: -152 }}
        />
        <AnimatedCircle
          color="#FFC107"
          size={115}
          animationType="position-opacity"
          delay={150}
          endPosition={{ y: 115 - 115 / 3.5, x: 0 }}
          circleStyle={{ top: -115, right: 42 }}
        />
        <AnimatedCircle
          color="#FF5252"
          size={90}
          animationType="position-opacity"
          delay={300}
          endPosition={{ y: 90 - 90 / 1.8, x: 0 }}
          circleStyle={{ top: -90, left: 42 }}
          empty
        />
        <View style={styles.leftSide}>
          <Text style={styles.greeting} numberOfLines={2} ellipsizeMode="tail">
            Hello {user.displayName},
          </Text>
          <Text style={styles.subtitle}>Ready to Play?</Text>
        </View>
        <View style={styles.rightSide}>
          <TouchableOpacity
            style={styles.imgButton}
            onPress={navigateToSettings}
          >
            <Image
              resizeMode="cover"
              source={{ uri: user.profilePic }}
              style={styles.profilePic}
            />
            {notificationCount > 0 ? (
              <View style={styles.badge}>
                <Text
                  style={[
                    styles.badgeText,
                    { fontSize: notificationCount < 10 ? 12 : 10 }
                  ]}
                >
                  {notificationCount < 10 ? notificationCount : '9+'}
                </Text>
              </View>
            ) : null}
            {user.isPro ? (
              <View style={styles.proBadge}>
                <Crown width={12} height={12} />
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.levelSection}>
          <Text style={styles.lvlTxtWrapper}>
            Lvl <Text style={styles.lvlTxt}>{user.level}</Text>
          </Text>
          <ProgressBar progress={(user.xp * 100) / user.nextXP} />
          <Text style={styles.progressTxt}>
            {user.nextXP - user.xp} until next level
          </Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.moneySection}>
          <View style={styles.coinWrapper}>
            <FontAwesome5 name="coins" size={24} color="#FFC107" />
            <Text style={styles.coins}>
              {user.coins} <Text style={styles.coinWord}>coins</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.getMore} onPress={openPurchase}>
            <Text style={styles.getMoreText}>Get More</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.livesSection}>
        <FontAwesome5 name="heart" color="#FF5252" size={14} solid />
        {user.isPro ? (
          <Text style={styles.livesText}>
            <Text style={{ fontFamily: 'sf-bold' }}>∞</Text> lives.
          </Text>
        ) : (
          <Text style={styles.livesText}>
            You have <Text style={{ fontFamily: 'sf-bold' }}>{user.lives}</Text>{' '}
            lives left.
          </Text>
        )}
      </View>
      {user.lifeDate && countdown.indexOf('-') === -1 ? (
        <Text style={[styles.livesText, styles.nextLife]}>
          Next life in {countdown} hours.
        </Text>
      ) : null}
    </>
  );
};

const HomeScreen = ({
  navigation,
  openPlay,
  closeNetworkModal,
  displayNetworkModal,
  openPurchase,
  openTerms,
  didRefetch,
  refetchUser
}) => {
  const userID = navigation.getParam('userID', '');
  const playFromFFA = navigation.getParam('playFromFFA', false);
  const { loading, data, refetch } = useQuery(GET_DATA, {
    variables: { _id: userID }
  });
  const {
    subscribeToMore,
    loading: loadingMatches,
    data: matchesData,
    refetch: refetchMatches
  } = useQuery(GET_USER_MATCHES, { variables: { _id: userID } });
  const [matches, setMatches] = useState(null);
  const [didSubscribe, setDidSubscribe] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [didCheckLives, setCheckLives] = useState(false);
  const [didCheckHistory, setCheckHistory] = useState(false);
  const [updateMatch] = useMutation(UPDATE_MATCH);
  const [deleteMatch] = useMutation(DELETE_MATCH);
  const [updateUser] = useMutation(UPDATE_USER);

  const user = data ? data.user : {};
  const friendRequests = data ? data.friendRequests : [];
  const matchCount = data ? data.ffaMatchCount : 0;

  useEffect(() => {
    if (matchesData && data) {
      separateMatches();
      checkExpiredMatches();
    }
  }, [matchesData, data]);

  useEffect(() => {
    if (subscribeToMore && !didSubscribe && data) {
      subscribeToNewMatches();
      subscribeToMatchUpdates();
      setDidSubscribe(true);
    }
  }, [subscribeToMore, data]);

  useEffect(() => {
    if (!loading && data && displayNetworkModal) closeNetworkModal();
  }, [loading, data]);

  useEffect(() => {
    if (playFromFFA) {
      setTimeout(() => openPlay({ playMode: 'FFA' }), 1);
    }
  }, [playFromFFA]);

  useEffect(() => {
    if (Object.prototype.hasOwnProperty.call(user, '_id') && !user.acceptedEula)
      displayTermsIfNeeded();
    if (Object.prototype.hasOwnProperty.call(user, '_id') && user.lifeDate)
      handleLivesCheck();
    if (Object.prototype.hasOwnProperty.call(user, '_id') && !didCheckHistory)
      checkPurchaseHistory();
  }, [user]);

  useEffect(() => {
    if (refetchUser) {
      refetch();
      didRefetch();
    }
  }, [refetchUser]);

  const subscribeToNewMatches = () =>
    subscribeToMore({
      document: CREATED_MATCH,
      variables: { userID: user._id },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newItem = subscriptionData.data.createdMatch;
        return { matches: [newItem, ...prev.matches] };
      }
    });

  const subscribeToMatchUpdates = () =>
    subscribeToMore({
      document: UPDATED_MATCH,
      variables: { userID: user._id },
      updateQuery: (prevData, { subscriptionData }) => {
        if (!subscriptionData.data) return prevData;
        const updatedItem = subscriptionData.data.updatedMatch;
        const index = prevData.matches.findIndex(
          match => match._id === updatedItem._id
        );
        if (index === -1) return prevData;
        if (updatedItem.removedBy.includes(user._id))
          return {
            matches: [
              ...prevData.matches.slice(0, index),
              ...prevData.matches.slice(index + 1)
            ]
          };
        return {
          matches: [
            ...prevData.matches.slice(0, index),
            updatedItem,
            ...prevData.matches.slice(index + 1)
          ]
        };
      }
    });

  const handlePurchaseHistory = async history => {
    const proDate = dayjs(user.proDate);
    let count = 0;
    history.some(item => {
      const purchaseDate = dayjs(
        item.originalPurchaseTime || item.purchaseTime
      );

      count += 1;

      return proDate.isSame(purchaseDate, 'day');
    });

    if (count === 0) return;

    const properties = JSON.stringify({
      proDate: dayjs(
        history[0].originalPurchaseTime || history[0].purchaseTime
      ),
      coins: user.coins + 180 * count
    });

    await updateUser({ variables: { id: user._id, properties } });
    refetch();
  };

  const checkPurchaseHistory = async () => {
    const proDate = dayjs(user.proDate);
    const nextMonth = dayjs(user.proDate).add(1, 'month');

    setCheckHistory(true);

    if (!user.isPro) return;

    if (dayjs().isBetween(proDate, nextMonth, 'day', '[]')) return;

    const code = await getBillingResponseCodeAsync();
    if (code === IAPResponseCode.ERROR) await connectAsync();

    const { responseCode, results } = await getPurchaseHistoryAsync(true);
    if (responseCode === IAPResponseCode.OK) {
      const platformProductId =
        Platform.OS === 'ios' ? 'dev.products.pro' : 'pro_monthly';
      const subscriptionHistory = results.filter(
        ({ productId }) => productId === platformProductId
      );

      if (
        subscriptionHistory.length === 0 ||
        dayjs().isAfter(
          dayjs(subscriptionHistory[0].purchaseTime).add(1, 'month')
        )
      ) {
        removePro();
        return;
      }

      handlePurchaseHistory(subscriptionHistory);
    }
  };

  const removePro = async () => {
    const properties = JSON.stringify({ isPro: false, proDate: null });
    await updateUser({ variables: { id: user._id, properties } });
    refetch();
  };

  const onAccept = () => refetch();

  const displayTermsIfNeeded = async () => {
    const showedEula = (await AsyncStorage.getItem('eula')) === 'true';
    if (showedEula) return;

    openTerms({ userID, onAccept });
    await AsyncStorage.setItem('eula', 'true');
  };

  const handleLivesCheck = async () => {
    const now = dayjs();
    const date = dayjs(user.lifeDate).add(4, 'h');
    let count = 0;
    let lifeDate = null;

    if (didCheckLives) return;
    setCheckLives(true);

    while (date.isBefore(now) && user.lives + count < 5) {
      count += 1;
      date.add(4, 'h');
    }

    if (count === 0) return;

    if (user.lives + count < 5) lifeDate = date.subtract(4, 'hour').toString();

    const properties = JSON.stringify({ lives: user.lives + count, lifeDate });

    await updateUser({ variables: { id: user._id, properties } });
    refetch();
  };

  const checkExpiredMatches = async () => {
    if (!matchesData.matches) return;
    let deleteFlag = false;
    const deletePromises = [];

    matchesData.matches.forEach(({ _id, expiresOn, state }) => {
      if (dayjs().diff(new Date(expiresOn)) > 0 && state !== 'end') {
        deletePromises.push(deleteMatch({ variables: { _id } }));
        deleteFlag = true;
      }
    });

    await Promise.all(deletePromises);

    if (deleteFlag) {
      await refetchMatches();
      separateMatches();
    }
  };

  const separateMatches = () => {
    const yourTurn = matchesData.matches.filter(
      match =>
        match.turn === user._id &&
        match.state !== 'end' &&
        match.state !== 'sending'
    );

    const theirTurn = matchesData.matches.filter(
      match =>
        (match.turn !== user._id && match.state !== 'end') ||
        match.state === 'sending'
    );

    const finished = matchesData.matches.filter(match => match.state === 'end');

    setMatches([
      {
        title: 'Your Turn',
        data: matchCount > 0 ? [{ name: 'ffa' }, ...yourTurn] : yourTurn
      },
      { title: 'Their Turn', data: theirTurn },
      { title: 'Finished Matches', data: finished }
    ]);
  };

  const navigateToSettings = () => navigation.navigate('Settings');
  const navigateToFFA = () => navigation.navigate('FFA', { userID: user._id });

  const handlePlay = (match, opponent) => () => {
    const route = match.state === 'play' ? 'Camera' : 'Match';
    navigation.navigate(route, {
      matchID: match._id,
      categoryID: match.category._id,
      opponentID: opponent._id,
      userID: user._id,
      mode: 'versus'
    });
  };

  const handleDelete = match => async () => {
    const removedBy = [...match.removedBy, user._id];
    const properties = JSON.stringify({ removedBy });

    await updateMatch({ variables: { matchID: match._id, properties } });

    if (match.removedBy.length >= 1)
      deleteMatch({ variables: { _id: match._id } });
  };

  const getOpponent = players => {
    if (players[0]._id === user._id) return players[1];
    return players[0];
  };

  const getPositionString = (index, title) => {
    let matchesLength;

    if (title === 'Your Turn') matchesLength = matches[0].data.length;
    else if (title === 'Their Turn') matchesLength = matches[1].data.length;
    else matchesLength = matches[2].data.length;

    if (index === 0 && matchesLength === index + 1) return 'FirstLast';
    if (index === 0) return 'First';
    if (matchesLength === index + 1) return 'Last';

    return 'Mid';
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await refetchMatches();
    setRefreshing(false);
  };

  const handleCountdownEnd = async () => {
    const properties = JSON.stringify({ lives: user.lives + 1 });
    await updateUser({ variables: { id: user._id, properties } });
    refetch();
  };

  const renderItem = args => {
    const { title } = args.section;
    const position = getPositionString(args.index, title);

    if (title === 'Your Turn' && args.index === 0 && matchCount > 0) {
      return <FFARow position={position} onPress={navigateToFFA} />;
    }

    const { players, category, score, expiresOn, state } = args.item;
    const opponent = getOpponent(players);
    const jsonScore = JSON.parse(score);
    const stringScore = `${jsonScore[user._id]} - ${jsonScore[opponent._id]}`;

    if (dayjs().diff(expiresOn) > 0 && state !== 'end') return null;

    return title !== 'Finished Matches' ? (
      <MatchRow
        score={stringScore}
        categoryUri={category.image}
        username={opponent.displayName}
        uri={opponent.profilePic}
        expiryDate={dayjs(expiresOn)}
        onPress={title === 'Your Turn' ? handlePlay(args.item, opponent) : null}
        position={position}
      />
    ) : (
      <FinishedMatchRow
        score={stringScore}
        username={opponent.displayName}
        uri={opponent.profilePic}
        onPress={handleDelete(args.item)}
        position={position}
      />
    );
  };

  const renderSectionHeader = args => {
    const { title } = args.section;
    if (title === 'Your Turn' && matches[0].data.length === 0) return null;
    if (title === 'Their Turn' && matches[1].data.length === 0) return null;
    if (title === 'Finished Matches' && matches[2].data.length === 0)
      return null;

    return (
      <Text
        style={[styles.title, { opacity: title !== 'Your Turn' ? 0.4 : 0.65 }]}
      >
        {title}
      </Text>
    );
  };

  const renderHeader = useMemo(() => {
    return (
      <Header
        user={user}
        navigateToSettings={navigateToSettings}
        openPurchase={openPurchase}
        notificationCount={friendRequests.length}
        onCountdownEnd={handleCountdownEnd}
      />
    );
  }, [user]);

  const renderEmpty = () => (
    <Empty
      title="No matches yet."
      description="Click play below to start playing with your friends!"
      action={openPlay}
      actionTitle="Play Now"
    />
  );

  const condition =
    matches &&
    matches[0].data.length === 0 &&
    matches[1].data.length === 0 &&
    matches[2].data.length === 0;

  return (
    <>
      {loading && loadingMatches ? (
        <Loader />
      ) : (
        <SafeAreaView
          style={{ flex: 1, backgroundColor: '#fff' }}
          forceInset={{ top: 'never' }}
        >
          <View style={styles.container}>
            <SectionList
              sections={condition ? null : matches}
              keyExtractor={item => item._id}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              extraData={[matchesData, condition]}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              ListHeaderComponent={renderHeader}
              ListEmptyComponent={renderEmpty}
            />
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCFCFE',
    minHeight: Layout.window.height - 52,
    overflow: 'hidden',
    paddingTop: 0,
    paddingBottom: 24
  },
  header: {
    flexDirection: 'row'
  },
  leftSide: {
    flexBasis: '80%',
    flexDirection: 'column',
    paddingLeft: 24,
    paddingTop: 36
  },
  rightSide: {
    alignItems: 'flex-end',
    flexBasis: '20%',
    paddingRight: 24,
    paddingTop: 36
  },
  greeting: {
    fontFamily: 'sf-bold',
    fontSize: 30,
    fontWeight: 'bold'
  },
  subtitle: {
    fontFamily: 'sf-thin',
    fontSize: 18,
    fontWeight: '100'
  },
  imgButton: {
    height: 42,
    width: 42
  },
  profilePic: {
    borderRadius: 42 / 2,
    height: 42,
    width: 42
  },
  info: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 24,
    paddingLeft: 24,
    paddingRight: 24
  },
  levelSection: {
    flexBasis: '50%'
  },
  verticalDivider: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    height: '100%',
    marginHorizontal: 12,
    width: 1
  },
  moneySection: {
    alignItems: 'center',
    flexBasis: '50%'
  },
  progressTxt: {
    fontFamily: 'sf-medium',
    textAlign: 'center'
  },
  lvlTxtWrapper: {
    fontFamily: 'sf-regular',
    fontSize: 16
  },
  lvlTxt: {
    fontSize: 24
  },
  coinWrapper: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  coins: {
    fontFamily: 'sf-bold',
    fontSize: 18,
    marginLeft: 12
  },
  coinWord: {
    fontSize: 8,
    fontFamily: 'sf-light'
  },
  getMore: {
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#7C4DFF',
    justifyContent: 'center',
    paddingVertical: 3,
    marginTop: 6,
    width: '80%'
  },
  getMoreText: {
    fontFamily: 'sf-medium',
    color: '#fff'
  },
  title: {
    fontFamily: 'sf-medium',
    fontSize: 16,
    marginTop: 24,
    marginLeft: 24,
    marginBottom: 12,
    opacity: 0.6,
    textTransform: 'uppercase'
  },
  divider: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    height: 1,
    marginTop: 12,
    width: '100%'
  },
  badge: {
    alignItems: 'center',
    backgroundColor: '#FF5252',
    borderRadius: 18 / 2,
    height: 18,
    justifyContent: 'center',
    position: 'absolute',
    right: -6,
    top: -6,
    width: 18
  },
  badgeText: {
    color: '#fff',
    fontFamily: 'sf-bold',
    fontSize: 10
  },
  proBadge: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18 / 2,
    height: 18,
    justifyContent: 'center',
    position: 'absolute',
    right: -3,
    bottom: -3,
    width: 18
  },
  livesSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6
  },
  livesText: {
    fontFamily: 'sf-regular',
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 6
  },
  nextLife: {
    alignSelf: 'center',
    top: Platform.OS !== 'ios' ? -6 : 0
  }
});

HomeScreen.propTypes = {
  navigation: object.isRequired,
  openPlay: func.isRequired,
  closeNetworkModal: func.isRequired,
  displayNetworkModal: bool.isRequired,
  openPurchase: func.isRequired,
  openTerms: func.isRequired,
  didRefetch: func.isRequired,
  refetchUser: bool.isRequired
};

Header.propTypes = {
  navigateToSettings: func.isRequired,
  user: shape({
    _id: string,
    displayName: string,
    profilePic: string,
    coins: number,
    level: number,
    xp: number,
    nextXP: number
  }).isRequired,
  notificationCount: number.isRequired,
  openPurchase: func.isRequired,
  onCountdownEnd: func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
