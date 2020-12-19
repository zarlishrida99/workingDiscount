import React , {useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert, Text  } from 'react-native';
import { Icon } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DataTable, TextInput} from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'black',
  },
  display: {
    flex: 1,
    justifyContent: "center"
  },
  input: {
    height: 50,
    padding: 10,
    marginBottom: 10,
    width: 250,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'pink',
    alignItems: 'center',
  },
  header: {
    width: '50%',
    height: 50,
    justifyContent: 'center',
  },
  headerText: {
    color: 'blue',
    fontSize: 30,
    fontFamily: 'Roboto',
    marginTop: 50,
    fontWeight: 'bold',
    margin: 0,
    textAlign: 'center',
  },
  scrollView: {
     marginHorizontal: 10,
  },
  text: {
    fontSize: 14,
    color: 'aliceblue',
    textAlign: "center",
    marginTop: 10,
  },
  results: {
    marginTop: 30
  },
  reset: {
    width: 150,
    marginLeft: 100,
  },
  save: {
    marginTop: 25,
    alignItems: "center",
    backgroundColor: "#ffff",
    padding: 10,
    color: '#005c97',
    shadowColor: 'black',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15 ,
    shadowOffset : { width: 1, height: 13},
    borderRadius: 25
  },
  saveText: {
    color: 'red', 
    fontFamily: 'Roboto',
    fontSize: 15, 
    fontWeight: 'bold',
    letterSpacing: 5.5
  },
  removeButton: {
    width: 5,
  }
});

const ScreenofHome = ({route, navigation}) => {
  const [money, priceChange] = useState("");
  const [discount, discountChange] = useState("");
  const [buttonState, setButtonState] = useState(true);
  const [memory, setMemory] = useState([]);
  const [id, setId] = useState(1);

  useEffect(() => {
    if (route.params?.history) {
      const data = route.params.history;
      setMemory(data);
      navigation.setParams({ history: undefined });
    }

    if (money!=="" && discount!=="" && eval(discount)<100 && buttonState===true)
      setButtonState(false);
    else if ((money==="" || discount==="" || eval(discount)>=100) && buttonState===false)
      setButtonState(true);
    else{}

  });

  let savedMoney ;
  let finalPrice ;
  let error = "" ;
  let display = "";

  const calcDiscount = (text) => {
    const localPrice = eval(money);
    const localDiscount = eval(discount);
    if (money!=="" && discount!=="" && localDiscount<100){
      savedMoney = (localPrice/100 * localDiscount).toFixed(2);
      finalPrice = (localPrice - savedMoney).toFixed(2);
      display = <View>
                         <Text style={styles.text}>Money Saved:   Rs. {savedMoney}</Text>
                         <Text style={styles.text}>Final Price:        Rs. {finalPrice}</Text>
                       </View> 
    }
    else if (money!=="" && discount!==""){
      error = "Discount cannot be greater than 100%";
      display = "";
    }
    else{}
  }

  const clearAndSave = () => {
    setId(id+1);
    setMemory([{
      id: id,
      money: money,
      finalPrice: finalPrice,
      discount: discount
    }, ...memory]);
    savedMoney=finalPrice=error="";
    discountChange("");
    priceChange("");
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={{marginRight: 10}}>
            <Icon
              name='history'
              type='font-awesome'
              color='#005C97'
              onPress={() => {
                navigation.navigate('Memory', {
                memory: memory
                });
              }}
            />
        </Text>
      ),
    });
  });

  return(
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Working Discount</Text>
      </View>
      <View style={styles.display}>
        <TextInput 
        style={styles.input} 
        value={money}
        label="Price  Rate"
        keyboardType='numeric'
        theme={{ colors: { text: 'black', primary: 'black' } }}
        onChangeText={text => priceChange(text)} />
        <TextInput 
        style={styles.input} 
        value={discount}
        label="Discount Rate"
        theme={{ colors: { text: 'black', primary: 'black' } }}
        keyboardType='numeric'
        onChangeText={text => discountChange(text)} />
        {calcDiscount()}
        <View style={styles.results}>
          <Text style={styles.text}>{error}</Text>
          <Text style={styles.text}>{display}</Text>
        </View>
        <View style={styles.reset}>
          <TouchableOpacity activeOpacity={0.7} disabled={buttonState}  onPress={clearAndSave} style={styles.save}> 
            <Text style={styles.saveText}>Press to Save</Text>
          </TouchableOpacity >
        </View>
      </View>
      </View> 
  );
}

const Screen = ({route, navigation}) => {
  const data = route.params.memory;
  const [history, setHistory] = useState(data);

  const handleRemove = (id) => {
    const list = history.filter(item => item.id !== id)
    setHistory(list);
  }

  const theme = {
    colors: { text: 'white'}
  }

  const clearHistory = () => {
    setHistory([])
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={{marginRight: 10}}>
            <Icon
              name='trash'
              type='font-awesome'
              color='#005C97'
              onPress={()=>{
                Alert.alert(
                  'Are you sure to clear history?',
                  'Confirm',
                  [
                    {text: 'Exit'},
                    {text: 'Clear', onPress: clearHistory},
                  ],
                  { cancelable: false }
                )
              }}
            />
        </Text>
      ),
      headerLeft: () => (
        <Text style={{marginLeft: 10}}>
            <Icon
              name='arrow-left'
              type='font-awesome'
              color='#005C97'
              onPress={() => {
                navigation.navigate('Dashboard', {
                history: history
                });
              }}
            />
        </Text>
      ),
    });
  });

  return(
      <View style={styles.container}> 
      <DataTable >
        <DataTable.Header >
          <DataTable.Title theme={theme}> Price </DataTable.Title>
          <DataTable.Title numeric theme={theme}> Discount </DataTable.Title>
          <DataTable.Title numeric theme={theme}> FinalPrice </DataTable.Title>
          <DataTable.Title style={{justifyContent:'flex-end'}} theme={theme}> Delete </DataTable.Title>
        </DataTable.Header>
        
        <ScrollView style={styles.scrollView}>
        {history.map(mem => 
            <DataTable.Row key={mem.id}>
              <DataTable.Title theme={theme}> {mem.price} </DataTable.Title>
              <DataTable.Title numeric theme={theme}> {mem.discount} </DataTable.Title>
              <DataTable.Title numeric theme={theme}> {mem.finalPrice} </DataTable.Title>
              <DataTable.Cell style={{justifyContent:'flex-end'}}>
                <Text>
                  <Icon
                    raised
                    name='remove'
                    type='font-awesome'
                    color='red'
                    onPress={() => handleRemove(mem.id)}
                    size={12}
                  />
                </Text>
              </DataTable.Cell>

            </DataTable.Row>
        )}
        </ScrollView>
      </DataTable>
      </View> 
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Dashboard" component={ScreenofHome}  />
        <Stack.Screen name="Memory" component={Screen} 
        options={{ title: 'Saved History' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}








