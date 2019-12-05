import React, { useEffect, useState } from 'react';
import {
  AsyncStorage,
  Image,
  ScrollView,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { useLazyQuery } from '@apollo/react-hooks';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import { func, object } from 'prop-types';

import GET_USER from '../graphql/queries/getUserFromToken';
import GET_USER_MATCHES from '../graphql/queries/getUserMatches';
import CREATED_MATCH from '../graphql/subscriptions/createdMatch';

import { togglePlay } from '../actions/popup';

import AnimatedCircle from '../components/AnimatedCircle';
import ProgressBar from '../components/LevelProgressBar';
import MatchRow from '../components/MatchRow';
import Loader from '../components/Loader';
import Empty from '../components/Empty';

import Layout from '../constants/Layout';

const mapDispatchToProps = dispatch => ({
  openPlay: () => dispatch(togglePlay(true))
});

const HomeScreen = ({ navigation, openPlay }) => {
  const [
    getMatches,
    { subscribeToMore, loading: loadingMatches, data: matchesData }
  ] = useLazyQuery(GET_USER_MATCHES);
  const [getUser, { loading, data }] = useLazyQuery(GET_USER);
  const [imageID, setImageID] = useState('');
  const [matches, setMatches] = useState(null);
  const [didSubscribe, setDidSubscribe] = useState(false);
  const user = data ? data.user : {};

  useEffect(() => {
    const focusScreen = navigation.addListener('willFocus', () => getImageID());
    getImageID();
    fetchData();
    return () => {
      focusScreen.remove();
    };
  }, []);

  useEffect(() => {
    if (matchesData) separateMatches();
  }, [matchesData]);

  useEffect(() => {
    if (subscribeToMore && !didSubscribe && data) {
      console.log(user);
      subscribeToNewMatches();
      setDidSubscribe(true);
    }
  }, [subscribeToMore, data]);

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

  const fetchData = async () => {
    const token = await AsyncStorage.getItem('CHRDS_TOKEN');
    const { _id } = jwtDecode(token);
    getUser({ variables: { token } });
    getMatches({ variables: { _id } });
  };

  const separateMatches = () => {
    const yourTurn = matchesData.matches.filter(
      match => match.turn === user._id
    );

    const theirTurn = matchesData.matches.filter(
      match => match.turn !== user._id
    );

    setMatches([
      { title: 'Your Turn', data: yourTurn },
      { title: 'Their Turn', data: theirTurn }
    ]);
  };

  const getImageID = async () => {
    const id = await AsyncStorage.getItem('IMG_ID');
    setImageID(id);
  };

  const navigateToSettings = () => navigation.navigate('Settings');

  const handlePlay = (match, opponent) => () => {
    if (match.state === 'play')
      navigation.navigate('Camera', {
        matchID: match._id,
        categoryID: match.category._id,
        opponentID: opponent._id
      });
    else {
      // go to matchScreen
    }
  };

  const getOpponent = players => {
    if (players[0]._id === user._id) return players[1];
    return players[0];
  };

  const renderItem = args => {
    const { title } = args.section;
    const { players, category, score, expiresOn } = args.item;
    const opponent = getOpponent(players);
    const jsonScore = JSON.parse(score);
    const stringScore = `${jsonScore[user._id]} - ${jsonScore[opponent._id]}`;
    return (
      <MatchRow
        score={stringScore}
        categoryUri={category.image}
        username={opponent.username}
        uri={opponent.profilePic}
        expiryDate={moment(new Date(expiresOn))}
        onPress={title === 'Your Turn' ? handlePlay(args.item, opponent) : null}
      />
    );
  };

  const renderSectionHeader = args => {
    const { title } = args.section;
    if (title === 'Your Turn' && matches[0].data.length === 0) return null;
    if (title === 'Their Turn' && matches[1].data.length === 0) return null;

    return <Text style={styles.title}>{title}</Text>;
  };

  return (
    <>
      <View style={styles.statusBar} />
      {loading && loadingMatches ? (
        <Loader />
      ) : (
        <ScrollView bounces={false}>
          <View style={styles.container}>
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
                <Text style={styles.greeting}>Hello {user.username},</Text>
                <Text style={styles.subtitle}>Ready to Play?</Text>
              </View>
              <View style={styles.rightSide}>
                <TouchableOpacity
                  style={styles.imgButton}
                  onPress={navigateToSettings}
                >
                  <Image
                    resizeMode="cover"
                    source={{ uri: `${user.profilePic}?imgID=${imageID}` }}
                    style={styles.profilePic}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.info}>
              <View style={styles.levelSection}>
                <Text style={styles.lvlTxtWrapper}>
                  Lvl <Text style={styles.lvlTxt}>{user.level}</Text>
                </Text>
                <ProgressBar progress={90} />
                <Text style={styles.progressTxt}>10 until next level</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.moneySection}>
                <View style={styles.coinWrapper}>
                  <FontAwesome5 name="coins" size={30} color="#FFC107" />
                  <Text style={styles.coins}>
                    {user.coins} <Text style={styles.coinWord}>coins</Text>
                  </Text>
                </View>
                <TouchableOpacity style={styles.getMore}>
                  <Text style={styles.getMoreText}>Get More</Text>
                </TouchableOpacity>
              </View>
            </View>
            {matches === null ? (
              <Loader />
            ) : (
              <View style={styles.lists}>
                {(matches[0] && matches[0].data.length > 0) ||
                  (matches[1] && matches[1].data.length > 0) ? (
                    <SectionList
                      sections={matches}
                      keyExtractor={item => item._id}
                      renderItem={renderItem}
                      renderSectionHeader={renderSectionHeader}
                    />
                ) : (
                  <Empty
                    title="No matches yet."
                    description="Click play below to start playing with your friends!"
                    action={openPlay}
                    actionTitle="Play Now"
                  />
                )}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FCFCFE',
    minHeight: Layout.window.height - 52,
    overflow: 'hidden',
    paddingTop: getStatusBarHeight(),
    paddingBottom: 24
  },
  statusBar: {
    backgroundColor: '#FCFCFE',
    height: getStatusBarHeight(),
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 5
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
    fontFamily: 'sf-light',
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
  }
});

HomeScreen.propTypes = {
  navigation: object.isRequired,
  openPlay: func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(HomeScreen);
