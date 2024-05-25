import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore, { setDoc } from '@react-native-firebase/firestore';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {

    function signOut() {
        return auth().signOut().then(() => { return navigation.navigate('Admin Login') })
    }

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text>This is some text lol</Text>
            <Button title="Sign out" onPress={signOut} />
            <Button title="Go to add data screen" onPress={() => navigation.navigate('Add Data')} />
        </View>
    )
}

const UpdateDataScreen = ({ navigation }) => {

    return (
        <View>

        </View>
    )

}

const AddDataScreen = ({ navigation }) => {

    const [data, setData] = useState('');
    const ref = firestore().collection('exampleCollection');

    const [docArr, setDocArr] = useState([{ id: 0, personName: "ThisIsAFillerPerson" }]);

    async function addData() {
        await ref.add({
            personName: data,
            age: 1111
        });
        setData('');
    }

    // constructor for the example documents
    function docSchema(id, personName) {
        this.id = id;
        this.personName = personName;
    }


    async function getAllDocs() {
        // this code was referenced from the documentation
        let smData = await ref.get().then((querySnapshot) => {
            console.log('Total docs: ', querySnapshot.size);
            let tempArr = [];
            querySnapshot.forEach(docSnap => {
                console.log('DocId: ', docSnap.id, docSnap.data().personName);
                let newObj = new docSchema(docSnap.id, docSnap.data().personName)
                tempArr = tempArr.concat(newObj);
                setDocArr(tempArr);
                console.log("This is the tempArr now: ", tempArr);
            });

        });
    }

    return (
        <View>
            <TextInput style={{ borderWidth: 2, borderColor: 'red', margin: 10 }} onChangeText={(newT) => setData(newT)} />
            <Button title='Add this data in example table' onPress={addData} />
            <View>
                <Text>{data}</Text>
            </View>
            <View>
                <Text>This is the docs from the db.. their ids?</Text>
                <Button title="updateTheRead" onPress={getAllDocs} />
                <Button title="Clear doc component array" onPress={() => { setDocArr([]) }} />
                <View>
                    {
                        docArr.map((doc) => {
                            return (
                                <Text key={doc.id}>
                                    {doc.personName}
                                </Text>
                            )
                        })
                    }
                    <Text>{ }</Text>
                </View>
            </View>
        </View>
    )
}

const AdmLogin = ({ navigation }) => {

    const [email, setEmail] = useState('arsalan@mail.com');
    const [pass, setPass] = useState('astro&%%boy');

    useEffect(() => {
        const unsub = auth().onAuthStateChanged(
            user => {
                if (user) {
                    navigation.replace('Home');
                }
            }
        )
    });

    function handleLogin() {
        auth().signInWithEmailAndPassword(email, pass).then((userCredentials) => {
            const user = userCredentials.user;
            console.log("Registered with: ", user.email);
        })
            .catch(
                error => {
                    console.log(error.message)
                }
            );
    }


    return (
        <View>
            <View style={styleSheet.inpBox}>
                <Text>Email Name</Text>
                <TextInput placeholder="Email here" style={styleSheet.inp} onChangeText={(newEmail) => { return setEmail(newEmail) }} />
            </View>
            <View style={styleSheet.inpBox}>
                <Text>Password</Text>
                <TextInput placeholder="Password here" style={styleSheet.inp} onChangeText={(newP) => { return setPass(newP) }} />
            </View>
            <View>
                <Button title="Sign In" onPress={handleLogin} />
            </View>
            <View>
                <Text>Email is admin@gmail.com and Pass is 123456789</Text>
            </View>

            <View>
                <Button title='Update Data Screen' onPress={() => navigation.navigate('Update Data')} />
            </View>

        </View>
    )
}

const App = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Admin Login" >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Admin Login" component={AdmLogin} />
                <Stack.Screen name="Add Data" component={AddDataScreen} />
                <Stack.Screen name="Update Data" component={UpdateDataScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styleSheet = StyleSheet.create({
    inpBox: {
        justifyContent: 'space-around', flexDirection: 'row', padding: 10
    },
    inp: {
        height: 23,
        width: 200,
        borderColor: "blue",
        borderWidth: 2,
        padding: 3
    }

})

export default App;
