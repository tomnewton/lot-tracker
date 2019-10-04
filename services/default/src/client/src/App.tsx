import React, {useState, useCallback} from 'react';
import {
  Page,
  Card,
  TextField,
  Form,
  FormLayout,
  Button,
  ButtonGroup,
  TopBar,
  Frame,
} from '@shopify/polaris';
import {LogOutMinor} from '@shopify/polaris-icons';

interface AccountProps {
  onAction(): void;
}

export default function App() {
  const [newsletter, setNewsletter] = useState(false);
  const [email, setEmail] = useState('');
  const [currentLot, setCurrentLot] = useState('3232432');

  const handleSubmit = useCallback((_event) => {
    setEmail('');
    setNewsletter(false);
  }, []);

  const handleNewsLetterChange = useCallback(
    (value) => setNewsletter(value),
    [],
  );


  const handleEmailChange = useCallback((value) => setEmail(value), []);
  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);

  
  return (
    <Frame topBar={TopBarExample()}>
    <Page>
      
    <Card sectioned>
      <Card.Section title="eShipper">
      <TextField value={currentLot} label="Current Lot" disabled helpText={
            <span>
              We are currently using this lot number.
            </span>
          }></TextField>
        </Card.Section>
    <Card.Section title="">
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        <TextField
          value={email}
          onChange={handleEmailChange}
          label="New Lot:"
          type="text"
          helpText={
            <span>
              We mark fulfilled orders with this lot number.
            </span>
          }
        />
        <ButtonGroup>
          <Button primary>Save</Button>
        </ButtonGroup>
      </FormLayout>
    </Form>
    </Card.Section>
    </Card>
    </Page>
    </Frame>
  );
}

function TopBarExample() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleIsUserMenuOpen = useCallback(
    () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
    [],
  );

  const handleNavigationToggle = useCallback(() => {
    console.log('toggle navigation visibility');
  }, []);


  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [{content: 'Log out', icon: LogOutMinor}],
        },
      ]}
      name="Rachael"
      detail="letsnixit.com"
      initials="RN"
      open={isUserMenuOpen}
      onToggle={toggleIsUserMenuOpen}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      onNavigationToggle={handleNavigationToggle}
    />
  );

  return topBarMarkup;
}