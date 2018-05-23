import React, {Component} from 'react';
import Autosuggest from 'react-autosuggest';

const theme = {
  container: {
    position: 'relative'
  },
  input: {
    width: 628,
    height: 42,
    padding: '10px 20px',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 16,
    border: '1px solid #aaa',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  inputFocused: {
    outline: 'none'
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  suggestionsContainer: {
    display: 'none'
  },
  suggestionsContainerOpen: {
    display: 'block',
    position: 'absolute',
    top: 42,
    width: 628,
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: 300,
    fontSize: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 2
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestion: {
    cursor: 'pointer',
    padding: '10px 20px'
  },
  suggestionHighlighted: {
    backgroundColor: '#ddd'
  }
};

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value, set) {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }
  if(!set || !set.result){
    return [];
  }else{
    set = set.result;
  }
  const regex = new RegExp('^' + escapedValue, 'i');
  try{
    return set.filter(country => regex.test(country.Country));
  }
  catch(e){
    return [];
  }
}

function getSuggestionValue(suggestion) {
  return suggestion.Country;
} 

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.Country}</span>
  );
}

export default class SearchBar extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };    
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };
  
  onSuggestionsFetchRequested = ({value}) => {
    this.setState({
      suggestions: getSuggestions(value, this.props.countryList)
    });
    this.props.onUpdate(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "countries...",
      value,
      onChange: this.onChange
    };

    return (
      <div className='container'>
        <div className='row justify-content-md-center' >
            <Autosuggest 
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              theme={theme}
            />
        </div>
        <br/>
        <div className='row justify-content-md-center'>
          <div className='col-md-4'>
            <a  href={"/country/" + this.state.value }>  
              <button class='btn-primary btn-lg btn-block' >Search</button>
           </a>
          </div>
        </div>
    </div>
    );
  }
}

