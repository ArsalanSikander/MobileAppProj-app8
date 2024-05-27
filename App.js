import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore, { setDoc } from '@react-native-firebase/firestore';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, ScrollView, Modal, StatusBar } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';


const Stack = createNativeStackNavigator();


const HomeScreen = ({ navigation }) => {

    const OptionBtns = ({ textInside, whatToDoOnPress }) => {
        return (
            <TouchableOpacity style={{ backgroundColor: '#0077b6', margin: 20, marginBottom: 0, padding: 20, borderRadius: 20, width: 300, justifyContent: 'center', alignItems: 'center' }} onPress={whatToDoOnPress}>
                <Text style={{ color: 'white', fontSize: 20 }}>
                    {textInside}
                </Text>
            </TouchableOpacity>
        )
    }

    function signOut() {
        return auth().signOut().then(() => { return navigation.navigate('Choose Login') })
    }

    return (
        <View style={{ margin: 15, backgroundColor: 'white', borderRadius: 20, padding: 20 }}>
            <Text style={{ fontSize: 20, color: 'black' }}>What would you like to do?</Text>
            <OptionBtns textInside={"Create a Student Account"} whatToDoOnPress={() => navigation.navigate('Add Student')} />
            <OptionBtns textInside={"Manage Students"} whatToDoOnPress={() => navigation.navigate('Update Data')} />
            <OptionBtns textInside={"View Reports"} whatToDoOnPress={() => { }} />
            <OptionBtns textInside={"Download Reports"} whatToDoOnPress={() => { }} />
            <OptionBtns textInside={"Manage Timetable"} whatToDoOnPress={() => { }} />
            <OptionBtns textInside={"Manage Syllabus"} whatToDoOnPress={() => { }} />
            {/* <Button title="Go to add data screen" onPress={() => navigation.navigate('Add Data')} /> */}
            <OptionBtns textInside={"Logout"} whatToDoOnPress={signOut} />
            {/* <Button title="Sign out" onPress={signOut} /> */}
        </View>
    )
}

const Logins = ({ navigation }) => {

    const CustomBtn = ({ textInside, descText, whatToDoOnPress }) => {
        return (
            <TouchableOpacity style={styleSheet.userLoginChooseBtn} onPress={whatToDoOnPress}>
                <Text style={{ color: 'white', fontSize: 21 }}>
                    {textInside}
                </Text>
                <Text style={{ color: 'white', fontSize: 15 }}>
                    {descText}
                </Text>
            </TouchableOpacity >
        )
    }

    return (
        <View style={{ backgroundColor: 'lightgray', height: '100%' }}>
            <View style={{ backgroundColor: 'white', margin: 20, marginTop: 40, padding: 15, borderRadius: 20, borderWidth: 0 }} >
                <Text style={{ fontSize: 22, color: '#03045e', fontWeight: 'bold', padding: 10, paddingTop: 18, paddingBottom: 17, alignSelf: 'center' }}>Choose what user to Login as</Text>
                <Text style={{ fontSize: 20, color: '#03045e', marginLeft: 15, paddingTop: 10, paddingBottom: 10 }} >I am a(n) ...</Text>
                <CustomBtn textInside={"Admin"} descText={"An admin is responsible for creating  student accounts, managing their fee status, and viewing student reports!"} whatToDoOnPress={() => { return navigation.navigate('Admin Login') }} />
                <CustomBtn textInside={"Teacher"} descText={"A teacher is responsible for managing the class assigned to them, performing activities such as uploading and updating their marks"} whatToDoOnPress={() => { }} />
                <CustomBtn textInside={"Student"} descText={"A student is able to view the marks of their respective subjects, including their current and previous grades. A student can also see their fee status and their timetable."} whatToDoOnPress={() => { }} />
            </View>
        </View>
    )
}

const AddStdScreen = ({ navigation }) => {

    const [theDate, setTheDate] = useState(new Date());

    const InputPlace = ({ labelText, phForTi, texVis = true, datePicVis = false, pickerVis = false }) => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor: 'gray', borderBottomWidth: 1, marginLeft: 20, marginRight: 20, marginTop: 5 }}>
                <Text style={{ paddingRight: 10 }}>{labelText}</Text>
                {texVis && <TextInput placeholder={phForTi} />}
            </View>
        )
    }

    return (
        <ScrollView >
            <View style={{ backgroundColor: "pink", margin: 5, paddingBottom: 30 }}>
                <InputPlace labelText='Registration No.' phForTi="eg. FA/SP00-BCS-000" />
                <InputPlace labelText={"Registration Date"} texVis={false} datePicVis={true} />
                <InputPlace labelText={"Name"} phForTi={"student's name"} />
                <InputPlace labelText={"Gender"} phForTi={'add binary picker here?'} />
                <InputPlace labelText={"Father's Name"} phForTi={"full name"} />
                <InputPlace labelText={"Caste"} phForTi={"any caste"} />
                <InputPlace labelText={"Occupation"} phForTi={'fathers current workplace'} />
                <InputPlace labelText={"Residence"} phForTi={'in any format'} />
                <InputPlace labelText={'Current Class'} phForTi={'picker'} />
                <InputPlace labelText={'Email'} phForTi={'student@gmail.com'} />
                <InputPlace labelText={'Password'} phForTi={'set password'} />
                <InputPlace labelText={'Remarks'} phForTi={'optional'} />
            </View>
        </ScrollView>
    )
}

const ChangeScreen = ({ navigation }) => {
    const route = useRoute();
    const [name, setName] = useState(route.params.name);

    let nameOfPerson = route.params.name;
    let idOfDoc = route.params.id;
    let ref = firestore().collection('exampleCollection');
    let updObj = {};

    async function updValuesOfDoc() {
        updObj.name = name;
        await ref.doc(route.params.id).update(
            // put the update object here
            {
                personName: name,
            }
        )
            .then(() => {
                console.log("The document was successfully updated!");
            })
    }

    async function getFields() {
        let smData = await ref.doc(idOfDoc).get().then((docSnap) => {
            let docData = docSnap.data();
            // console.log("This is the doc data: ", docData);/
            // we need to know the field, else hardcode it
        });
    }


    return (
        <View>
            <Text>{route.params.id}</Text>
            <Text>{route.params.name}</Text>
            <Button title="consoleLog the data" onPress={getFields} />
            <View>
                <View>
                    <Text>Name={name}</Text>
                    <TextInput value={name} placeholder={route.params.name} style={{ borderWidth: 2, borderColor: "red" }} onChangeText={(newT) => { setName(newT) }} />
                </View>
                <View>
                    <Button title="Save Updates" onPress={updValuesOfDoc} />
                </View>
            </View>

        </View>
    )
}

const UpdateDataScreen = ({ navigation }) => {

    const route = useRoute();
    const [data, setData] = useState('');
    const ref = firestore().collection('exampleCollection');
    const [docArr, setDocArr] = useState([]);
    useEffect(() => {
        getAllDocs();
    }, []);


    function docSchema(id, personName) {
        this.id = id;
        this.personName = personName;
    }

    async function deleteDoc(idToDelete) {
        await ref.doc(idToDelete).delete().then(() => {
            console.log("The document was deleted!");
        })

        // getAllDocs();
    }

    async function getAllDocs() {
        // this code was referenced from the documentation

        await ref.get().then((querySnapshot) => { // to execute the collection getting, use get() and use the data recieved in form of querySnapshot
            console.log('Total docs: ', querySnapshot.size);
            let tempArr = [];
            if (querySnapshot.size != 0) {
                querySnapshot.forEach(docSnap => {
                    console.log('DocId: ', docSnap.id, docSnap.data().personName);
                    let newObj = new docSchema(docSnap.id, docSnap.data().personName)
                    tempArr = tempArr.concat(newObj);
                    setDocArr(tempArr);
                    console.log("This is the tempArr now: ", tempArr);
                });
            }
            else {
                setDocArr(tempArr);
            }

        });
    } //this gives us all the docs, this should be on the view page btw

    return (
        <View>
            {/* <Button title="updateTheRead" onPress={getAllDocs} /> */}
            <ScrollView>
                {
                    docArr.map((doc) => {
                        return (
                            <View key={doc.id} style={{ flexDirection: 'row', justifyContent: 'space-between', borderWidth: 2, borderRadius: 20, borderColor: 'lightblue', margin: 10, marginLeft: 20, padding: 30 }}>
                                <Text style={{ fontSize: 20, width: 160, height: 30 }}>
                                    {doc.personName}
                                </Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Button title='Update' onPress={() => navigation.navigate('Change', { name: doc.personName, id: doc.id })} />
                                    <Button title='Delete' onPress={() => deleteDoc(doc.id)} />
                                </View>
                            </View>
                        )
                    })
                }


            </ScrollView>

        </View >
    )

}

const AddDataScreen = ({ navigation }) => {

    const [data, setData] = useState('');
    const ref = firestore().collection('exampleCollection');
    const [message, setMessage] = useState('ThisIsTheNewHeader');
    const [docArr, setDocArr] = useState([]);
    getAllDocs();

    async function addData() {
        await ref.add({
            personName: data,
            age: 1111
        });
        setData('');

        getAllDocs();

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
            <Button title='Update data screen' onPress={() => navigation.navigate('Update Data', { message, })} />
            <Button title='Create Student Account' onPress={() => { return navigation.navigate('Add Student Account') }} />
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
                <Text style={{ color: 'black', paddingLeft: 20 }}>Email</Text>
                <TextInput placeholder="Email address" style={styleSheet.inp} onChangeText={(newEmail) => { return setEmail(newEmail) }} />
            </View>
            <View style={styleSheet.inpBox}>
                <Text style={{ color: 'black', paddingLeft: 20 }}>Password</Text>
                <TextInput placeholder="Password" style={styleSheet.inp} onChangeText={(newP) => { return setPass(newP) }} />
            </View >
            <View style={{ width: 80, height: 40, alignSelf: 'flex-end', paddingRight: 13 }}>
                <Button title="Sign In" onPress={handleLogin} />
            </View>
            <View>
                <Text style={{ color: 'black' }}>Email is admin@gmail.com and Pass is 123456789</Text>
            </View>
        </View>
    )
}

const App = () => {

    return (
        <NavigationContainer>
            <StatusBar />
            <Stack.Navigator initialRouteName="Choose Login" >
                <Stack.Screen name='Choose Login' component={Logins} options={{ headerTitle: 'School Management App' }} />
                <Stack.Screen name='Admin Login' component={AdmLogin} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerTitle: 'Welcome to Admin Homepage!' }} />
                <Stack.Screen name='Add Student' component={AddStdScreen} />
                <Stack.Screen name="Add Data" component={AddDataScreen} />
                <Stack.Screen name="Update Data" component={UpdateDataScreen} />
                <Stack.Screen name="Change" component={ChangeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styleSheet = StyleSheet.create({
    inpBox: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'whitesmoke',
    },
    inp: {
        height: 23,
        width: 200,
        borderRadius: 50,
        padding: 3,
        backgroundColor: 'lightgray',
        color: 'black'
    },
    userLoginChooseBtn: {
        padding: 30,
        paddingTop: 17,
        margin: 5,
        borderRadius: 20,
        backgroundColor: '#0077b6'
    },
    whiteText: {
        color: 'white',
    }

})

export default App;
