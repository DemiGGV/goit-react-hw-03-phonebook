import { Component } from 'react';
import { nanoid } from 'nanoid';
import { GlobalStyle } from './GlobalStyle';
import { Title, ContainerCSS } from './MainContainerCSS';
import { Form } from './Form/Form';
import { Filter } from './Filter/Filter';
import { ContactsList } from './ContactsList/ContactsList';
import LStorage from './storage';

const lStor = new LStorage();
const LSKEY = 'phonebook';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    if (lStor.load(LSKEY)) {
      const contacts = lStor.load(LSKEY);
      this.setState({ contacts });
    }
  }

  componentDidUpdate(_, prevState) {
    const { contacts } = this.state;
    if (prevState.contacts.length !== contacts.length) {
      lStor.save(LSKEY, contacts);
    }
    !contacts.length && lStor.remove(LSKEY);
  }

  handleInputChange = evt => {
    this.setState({
      [evt.currentTarget.name]: evt.currentTarget.value.trim(),
    });
  };

  handleOnSubmit = state => {
    if (
      this.state.contacts.find(
        contact => contact.name.toLowerCase() === state.name.toLowerCase()
      )
    ) {
      alert(`${state.name} is already in contacts!`);
      return;
    }
    const contact = {
      id: nanoid(),
      name: state.name,
      number: state.number,
    };
    this.setState(prevState => ({
      contacts: [...prevState.contacts, contact],
    }));
  };

  deleteEntries = idToDelete => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== idToDelete),
    }));
  };

  render() {
    const { contacts, filter } = this.state;
    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
    return (
      <ContainerCSS>
        <Title>Phonebook</Title>
        <Form formSubmit={this.handleOnSubmit} />
        <Title>Contacts</Title>
        <Filter text={filter} onChange={this.handleInputChange} />
        {!!filteredContacts.length && (
          <ContactsList
            contacts={filteredContacts}
            onDelete={this.deleteEntries}
          />
        )}
        <GlobalStyle />
      </ContainerCSS>
    );
  }
}
