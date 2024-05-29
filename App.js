import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { utils } from '@react-native-firebase/app';
import firestore, { setDoc } from '@react-native-firebase/firestore';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, ScrollView, Modal, StatusBar, Image } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { launchImageLibrary as _launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
import { DateTimePicker } from '@react-native-community/datetimepicker';
let launchImageLibrary = _launchImageLibrary;

// TO DO
// ---> Make the student add thingy
// ---> and the fee structure thing
// ---> we can make the Cloud Storage and 



const Stack = createNativeStackNavigator();


const ManageTimetable = () => {

    const [selectedImage, setSelectedImage] = useState(null);

    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 5000,
            maxWidth: 5000,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
                console.log("Something happened: ", imageUri);
            }
        });
    };

    return (
        <View style={{ backgroundColor: 'lightgray', width: '100%', height: '100%', }}>
            <View style={{ backgroundColor: 'white', padding: 30, borderRadius: 20, margin: 20 }}>
                <TouchableOpacity onPress={openImagePicker}>
                    <Text style={{ color: 'black' }}>
                        Upload a Timetable
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: 'lightgray' }}>
                {selectedImage && (
                    <Image
                        source={{ uri: selectedImage }}
                        style={{ height: 100, width: 100, backgroundColor: 'white' }}
                        resizeMode='contain'
                    />
                )}
            </View>
        </View>
    )
}

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
        <ScrollView style={{ backgroundColor: 'lightgray' }}>
            <View style={{ margin: 15, backgroundColor: 'white', borderRadius: 20, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, color: 'black' }}>What would you like to do?</Text>
                <OptionBtns textInside={"Create a Student Account"} whatToDoOnPress={() => navigation.navigate('Add Student')} />
                <OptionBtns textInside={"Manage Students"} whatToDoOnPress={() => navigation.navigate('Update Data')} />
                <OptionBtns textInside={"View Reports"} whatToDoOnPress={() => { }} />
                <OptionBtns textInside={"Download Reports"} whatToDoOnPress={() => { }} />
                <OptionBtns textInside={"Manage Timetable"} whatToDoOnPress={() => { navigation.navigate('Manage Timetable') }} />
                <OptionBtns textInside={"Manage Syllabus"} whatToDoOnPress={() => { }} />
                <OptionBtns textInside={"Logout"} whatToDoOnPress={signOut} />
            </View>
        </ScrollView>
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
        <ScrollView style={{ backgroundColor: 'lightgray', height: '100%' }}>
            <View style={{ backgroundColor: 'white', margin: 20, marginTop: 40, padding: 15, borderRadius: 20, borderWidth: 0 }} >
                <Text style={{ fontSize: 22, color: '#03045e', fontWeight: 'bold', padding: 10, paddingTop: 18, paddingBottom: 17, alignSelf: 'center' }}>Choose what user to Login as</Text>
                <Text style={{ fontSize: 20, color: '#03045e', marginLeft: 15, paddingTop: 10, paddingBottom: 10 }} >I am a(n) ...</Text>
                <CustomBtn textInside={"Admin"} descText={"An admin is responsible for creating  student accounts, managing their fee status, and viewing student reports!"} whatToDoOnPress={() => { return navigation.navigate('Admin Login') }} />
                <CustomBtn textInside={"Teacher"} descText={"A teacher is responsible for managing the class assigned to them, performing activities such as uploading and updating their marks"} whatToDoOnPress={() => { }} />
                <CustomBtn textInside={"Student"} descText={"A student is able to view the marks of their respective subjects, including their current and previous grades. A student can also see their fee status and their timetable."} whatToDoOnPress={() => { }} />
            </View>
        </ScrollView>
    )
}

const AddStdScreen = ({ navigation }) => {

    // the users data is shown here
    const [dispDate, setDispDate] = useState('none');
    const [regno, setRegno] = useState('');
    const [regDate, setRegDate] = useState('none');
    const [stuName, setStuName] = useState('');


    const handleDateChange = (event, date) => { //gets the set date event
        setShowDate(false);
        console.log("This is the date we get directly : ", date);
        //lets first save the date in milliseconds
        let gotDate = new Date(Date.parse(date)); // this doesnt do anything
        setRegDate(gotDate);
        setDispDate(gotDate.toDateString());
    }

    const [showDate, setShowDate] = useState(false);

    const InputPlace = ({ labelText, phForTi, texVis = true, datePicVis = false, pickerVis = false }) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 20, marginRight: 20, marginTop: 5, margin: 5 }}>
                <Text style={{ paddingRight: 10, color: '#03045E' }}>{labelText}</Text>
                {texVis && <TextInput placeholder={phForTi} style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 20, color: '#0077B6', width: 200, height: 40, margin: 0, paddingLeft: 20 }} />}
                {datePicVis &&
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginRight: 30, borderWidth: 1, borderRadius: 20, borderColor: 'lightgray', padding: 20 }}>
                        <TouchableOpacity style={{ backgroundColor: 'lightblue', borderRadius: 10, padding: 10 }} onPress={() => { setShowDate(true) }}>
                            <Text>Select Date</Text>
                        </TouchableOpacity>
                        <Text>{dispDate}</Text>
                        {showDate && <DateTimePickerAndroid mode={'date'} onChange={handleDateChange} value={new Date()} />}
                    </View>

                }
            </View>
        )
    }


    const [stuGen, setStuGen] = useState('');
    const [stuFName, setStuFName] = useState('');
    const [stuCaste, setStuCaste] = useState('');


    return (
        <ScrollView style={{ backgroundColor: 'lightgray' }} >
            <View style={{ justifyContent: 'center', backgroundColor: "white", margin: 5, padding: 10, paddingVertical: 20, borderRadius: 40, margin: 7 }}>
                <Text style={{ alignSelf: 'center', color: 'black', fontSize: 20, fontWeight: 'bold', margin: 10 }}>Enter values for New Student</Text>
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

    const [email, setEmail] = useState('admin@gmail.com');
    const [pass, setPass] = useState('123456789');
    const quickLogin = () => {
        setEmail('admin@gmail.com');
        setPass('123456789');
        console.log("Values were automatically filled in using quick-login.");
    }

    useEffect(() => {   // this one checks the auth state and navigates to the home page of the admin
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

    const InputThing = ({ labelText, placeholder, whatToDoOnPress, val }) => {
        return (
            <View style={styleSheet.inpBox}>
                <Text style={{ color: 'black', paddingLeft: 20 }}>{labelText}</Text>
                <TextInput placeholder={placeholder} style={styleSheet.inp} onChangeText={whatToDoOnPress} value={val} />
            </View>
        )
    }

    return (
        <View style={{ backgroundColor: 'lightgray', height: '100%' }}>
            <View style={{ backgroundColor: 'white', borderRadius: 20, margin: 20, padding: 20 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
                    <Text style={{ fontSize: 20, color: '#03045E', fontWeight: 'bold' }}>Enter your credentials</Text>
                </View>
                <InputThing labelText={"Email"} placeholder={"Email address"} whatToDoOnPress={setEmail} val={email} />
                <InputThing labelText={"Password"} placeholder={"Password"} whatToDoOnPress={setPass} val={pass} />
                <View style={{ alignSelf: 'center', padding: 20 }}>
                    <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: '#0077b6', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 20 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={quickLogin} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
                        <Text style={{ fontSize: 40 }}>
                            .
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text>{email} and {pass}</Text>
            </View>
        </View >
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
                <Stack.Screen name="Manage Timetable" component={ManageTimetable} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styleSheet = StyleSheet.create({
    inpBox: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 5,
        // backgroundColor: 'gray',
        margin: 5
    },
    inp: {
        height: 40,
        width: 200,
        borderRadius: 50,
        padding: 10,
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
