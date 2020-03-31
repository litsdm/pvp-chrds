import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { func } from 'prop-types';

import GET_DATA from '../../graphql/queries/getSuggestionData';
import SUGGEST_CATEGORY from '../../graphql/mutations/suggestCategory';
import SUGGEST_WORD from '../../graphql/mutations/suggestWord';

import { useUserID } from '../../helpers/hooks';

import PagePopup from '../PagePopup';
import SelectTypePage from './SelectType';
import SelectCategory from './SelectCategory';
import WordForm from './WordForm';
import CategoryForm from './CategoryForm';

const SuggestPopup = ({ close, displayBadge }) => {
  const userID = useUserID();
  const [fetchData, { data }] = useLazyQuery(GET_DATA);
  const [suggestCategory] = useMutation(SUGGEST_CATEGORY);
  const [suggestWord] = useMutation(SUGGEST_WORD);
  const [page, setPage] = useState(0);
  const [type, setType] = useState('');
  const [category, setCategory] = useState({});
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [actorHint, setActorHint] = useState('');

  const categories = data ? data.categories : [];
  const suggestedCategories = data ? data.suggestedCategories : [];
  const allCategories = [...categories, ...suggestedCategories];

  useEffect(() => {
    if (userID) fetchData({ variables: { _id: userID } });
  }, [userID]);

  const selectType = newType => () => {
    setType(newType);
    setPage(1);
  };

  const selectCategory = newCategory => () => {
    setCategory(newCategory);
    setPage(2);
  };

  const back = () => setPage(page - 1);

  const handleTextChange = tag => value => {
    switch (tag) {
      case 'word':
        setWord(value);
        break;
      case 'hint':
        setHint(value);
        break;
      case 'actorHint':
        setActorHint(value);
        break;
      case 'name':
        setName(value);
        break;
      case 'description':
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const isValid = () => {
    let errorMessage = '';

    if (type === 'Category') {
      if (!description) errorMessage = 'A description is required.';
      if (!name) errorMessage = 'A name is required.';
    } else {
      if (!hint) errorMessage = 'A hint for the guesser is required.';
      if (!word) errorMessage = 'Please type your word.';
    }

    if (errorMessage) {
      displayBadge(errorMessage, 'error');
      console.log(errorMessage);
      return false;
    }

    return true;
  };

  const submitWord = async () => {
    const variables = { text: word, hint, actorHint, sender: userID };

    if (category.sender) variables.suggestCategory = category._id;
    else variables.category = category._id;

    console.log(variables);

    if (!isValid()) return;

    try {
      await suggestWord({ variables });
      displayBadge(
        "Word submitted! We'll review it and get back to you.",
        'success'
      );
      close();
    } catch (exception) {
      console.log(exception.message);
      displayBadge('We encountered an error creating your word.', 'error');
    }
  };

  const submitCategory = async () => {
    const variables = { name, description, sender: userID };

    if (!isValid()) return;

    try {
      await suggestCategory({ variables });
      displayBadge(
        "Category submitted! We'll review it and get back to you",
        'success'
      );
      close();
    } catch (exception) {
      console.log(exception.message);
      displayBadge('We encountered an error creating your category.', 'error');
    }
  };

  return (
    <PagePopup close={close} title="Suggest" page={page} back={back}>
      <SelectTypePage selectType={selectType} />
      {type === 'Category' ? (
        <CategoryForm
          type={type}
          name={name}
          description={description}
          setState={handleTextChange}
          submit={submitCategory}
        />
      ) : (
        <SelectCategory
          categories={allCategories}
          selectCategory={selectCategory}
        />
      )}
      <WordForm
        type={type}
        category={category}
        word={word}
        hint={hint}
        actorHint={actorHint}
        setState={handleTextChange}
        submit={submitWord}
      />
    </PagePopup>
  );
};

SuggestPopup.propTypes = {
  close: func.isRequired,
  displayBadge: func.isRequired
};

export default SuggestPopup;
