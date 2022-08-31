import { useState, useEffect } from 'react';
import { Providers, ProviderState } from '@microsoft/mgt';
import { Login, Person, Agenda, PeoplePicker, People } from '@microsoft/mgt-react'; // import login component
import { Header, List } from 'semantic-ui-react';


function useIsSignedIn(): [boolean] {
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    const updateState = () => {
      const provider = Providers.globalProvider;
      setIsSignedIn(provider && provider.state === ProviderState.SignedIn);
    };

    Providers.onProviderUpdated(updateState);
    updateState();

    return () => {
      Providers.removeProviderUpdatedListener(updateState);
    }
  }, []);

  return [isSignedIn];
}

function App() {
const [isSignedIn] = useIsSignedIn();
const [people, setPeople] = useState([]);
const [activities, setActivities] = useState([]);

const getActivities = () => {
  if (Providers.globalProvider.state === ProviderState.SignedIn) {
    const provider = Providers.globalProvider;
    let graphClient = provider.graph.client;
    graphClient.api('/groups/88d59881-7b15-4adc-a756-5d10681cf99d/calendar/events').get()
    .then(response => {
      console.log(response);
      setActivities(response.value)
    })
    }
}

const providerStateChanged = () => {
  console.log('provider State Changed');
    getActivities();
  }

useEffect(() => {
  console.log('use effect');
  getActivities();
},[])

Providers.onProviderUpdated(providerStateChanged);

const handleSelectionChanged = (e: any) => {
  setPeople(e.target.selectedPeople);
};


return (
  <div>
    <Header as='h1' textAlign='right'>
      <Login />
    </Header>
    {/*
  <header>
  <Login />
  </header>
*/}
  {isSignedIn &&
    <div>
     { /*<div>
        <p>Person Component : <Person personQuery="me"></Person></p>
      </div>
      <div style={{ width: "400px" }}>
        <p>People Picker Component : <PeoplePicker selectionChanged={handleSelectionChanged} /></p>
        <p>People Component: <People people={people} /></p>
      </div>
      <div>
      <Agenda />
      </div>*/}
      <List>
      {activities.map((activity: any) => (
          <List.Item key={activity.id}>
            {activity.subject}
            </List.Item>
        ))}
      </List>
     
  </div> }
</div>
);
}

export default App;
