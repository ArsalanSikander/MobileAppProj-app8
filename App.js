import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore, { doc } from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage'
import { utils } from '@react-native-firebase/app';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, ScrollView, StatusBar, Image, FlatList } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { launchImageLibrary as _launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerAndroid from '@react-native-community/datetimepicker';
let launchImageLibrary = _launchImageLibrary;



const Stack = createNativeStackNavigator();

const ManageSyllabus = () => {
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
                        Upload a Syllabus for a Class
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: 'lightgray' }}>
                {selectedImage && (
                    <View style={{ borderWidth: 1, borderRadius: 30, padding: 30, margin: 50, overflow: 'hidden' }}>
                        <Image
                            source={{ uri: selectedImage }}
                            style={{ height: 300, width: 400 }}
                            resizeMode='center'
                        />
                    </View>

                )}
            </View>
        </View>
    )

}

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
                setSelectedImage(imageUri);   // uri of the image is saved in this state hook
                console.log("Something happened: ", imageUri);
            }
        });
    };

    const reference = storage().ref('timetableWholeYear.jpg');

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
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderWidth: 0, borderRadius: 30, padding: 10, margin: 50, overflow: 'hidden' }}>
                        <Image
                            source={{ uri: selectedImage }}
                            style={{ width: '100%', height: 'auto', aspectRatio: 1, borderWidth: 1, borderRadius: 20, padding: 0 }}
                            resizeMode='contain'
                        />
                        <View>
                            <TouchableOpacity style={{ padding: 10, margin: 10, backgroundColor: 'lightblue', }} onPress={async () => {
                                await reference.putFile(selectedImage).then(() => { console.log('Image was successfully stored in Firestore Cloud Storage') })
                            }}>
                                <Text style={{ color: 'white' }}>Upload Image</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

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
                <OptionBtns textInside={"Manage Fees"} whatToDoOnPress={() => { navigation.navigate('Fee Manage') }} />
                <OptionBtns textInside={"View Reports"} whatToDoOnPress={() => { }} />
                <OptionBtns textInside={"Download Reports"} whatToDoOnPress={() => { }} />
                <OptionBtns textInside={"Manage Timetable"} whatToDoOnPress={() => { navigation.navigate('Manage Timetable') }} />
                <OptionBtns textInside={"Manage Syllabus"} whatToDoOnPress={() => { navigation.navigate('Manage Syllabus') }} />
                <OptionBtns textInside={"Logout"} whatToDoOnPress={signOut} />
            </View>
        </ScrollView>
    )
}

const OptionBtns = ({ textInside, whatToDoOnPress }) => {
    return (
        <TouchableOpacity style={{ backgroundColor: '#0077b6', margin: 20, marginBottom: 0, padding: 20, borderRadius: 20, width: 300, justifyContent: 'center', alignItems: 'center' }} onPress={whatToDoOnPress}>
            <Text style={{ color: 'white', fontSize: 20 }}>
                {textInside}
            </Text>
        </TouchableOpacity>
    )
}

const StuHome = ({ navigation }) => {

    function signOut() {
        return auth().signOut().then(() => { return navigation.navigate('Choose Login') })
    }

    return (
        <ScrollView style={{ backgroundColor: 'lightgray' }}>
            <View style={{ margin: 15, backgroundColor: 'white', borderRadius: 20, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, color: 'black' }}>What would you like to do?</Text>
                <OptionBtns textInside={"View your marks"} whatToDoOnPress={() => { navigation.navigate('Marks Screen') }} />
                <OptionBtns textInside={"Previous Academic Records"} whatToDoOnPress={() => { }} />
                <OptionBtns textInside={"View Fee Status"} whatToDoOnPress={() => { }} />
                <OptionBtns textInside={"View Current Syllabus"} whatToDoOnPress={() => { }} />
                <OptionBtns textInside={"View Timetable"} whatToDoOnPress={() => { navigation.navigate('View Timetable') }} />
                <OptionBtns textInside={"Log Out"} whatToDoOnPress={signOut} />
            </View>
        </ScrollView>
    )
}

const Viewtimetable = () => {

    const [timetablee, setTimetablee] = useState(undefined);

    useEffect(async () => {
        await storage().ref('timetableWholeYear.jpg').getDownloadURL().then((url) => {
            setTimetablee(url);
        })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    return (
        <View style={{ backgroundColor: 'lightgray', height: '100%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 30, margin: 20, color: 'black' }}>Timetable</Text>
            <Image src={{ uri: timetablee }} />

        </View>
    )
}

const MarkScreen = () => {
    return (
        <ScrollView style={{ backgroundColor: 'lightgray', height: '100%' }}>
            <View style={{ margin: 20, borderRadius: 30, padding: 10, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                < OptionBtns textInside={"First Term Marks"} whatToDoOnPress={() => { }} />
                <OptionBtns textInside={"Mid Term Marks"} whatToDoOnPress={() => { }} />
                <OptionBtns textInside={"Final Exam Marks"} whatToDoOnPress={() => { }} />
            </View>
        </ScrollView >
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
                <CustomBtn textInside={"Teacher"} descText={"A teacher is responsible for managing the class assigned to them, performing activities such as uploading and updating their marks"} whatToDoOnPress={() => { navigation.navigate('Teacher Login') }} />
                <CustomBtn textInside={"Student"} descText={"A student is able to view the marks of their respective subjects, including their current and previous grades. A student can also see their fee status and their timetable."} whatToDoOnPress={() => { navigation.navigate('Student Login') }} />
            </View>
        </ScrollView>
    )
}

const AddStdScreen = ({ navigation }) => {

    // the users data is shown here
    const [dispDate, setDispDate] = useState('none');
    const [dispDate2, setDispDate2] = useState('none');

    const [regno, setRegno] = useState('');
    const [regDate, setRegDate] = useState('none');
    const [stuName, setStuName] = useState('');
    const [stuDob, setStuDob] = useState('');
    const [stuGen, setStuGen] = useState('gender');
    const [stuFName, setStuFName] = useState('');
    const [stuCaste, setStuCaste] = useState('');
    const [stuOcc, setStuOcc] = useState('');
    const [stuRes, setStuRes] = useState('');
    const [stuClass, setStuClass] = useState('');
    const [stuEmail, setStuEmail] = useState('');
    const [stuPass, setStuPass] = useState('');
    const [stuRem, setStuRemarks] = useState('');


    const handleDateChange = (event, date) => { //gets the set date event
        setShowDate(false);
        console.log("This is the date we get directly : ", date);
        //lets first save the date in milliseconds
        let gotDate = new Date(Date.parse(date)); // this doesnt do anything
        setRegDate(gotDate);
        setDispDate(gotDate.toDateString());
    }

    const handleDateChange2 = (event, date) => {
        setShowDate2(false);
        let gotDate = new Date(Date.parse(date));
        setStuDob(gotDate);
        setDispDate2(gotDate.toDateString());
    }

    const [showDate, setShowDate] = useState(false);
    const [showDate2, setShowDate2] = useState(false);

    const DateSelector = ({ dateDispControl, dateDispController, onChangeAction, inText }) => {
        return (
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginRight: 30, borderWidth: 1, borderRadius: 20, borderColor: 'lightgray', padding: 20 }}>
                <TouchableOpacity style={{ backgroundColor: 'lightblue', borderRadius: 10, padding: 10 }} onPress={dateDispControl}>
                    <Text>Select Date</Text>
                </TouchableOpacity>
                <Text style={{ color: 'black' }}>{inText}</Text>
                {dateDispController && <DateTimePickerAndroid mode={'date'} onChange={onChangeAction} value={new Date()} />}
            </View>
        )
    }

    // make a custom component with some default parameters 
    const InputPlace = ({ labelText, phForTi, texVis = true, datePicVis = false, datePicVis2 = false, genChoice = false, chg = () => { }, val = '' }) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 20, marginRight: 20, marginTop: 5, margin: 5 }}>
                <Text style={{ paddingRight: 10, color: '#03045E' }}>{labelText}</Text>
                {texVis && <TextInput placeholder={phForTi} style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 20, color: '#0077B6', width: 200, height: 40, margin: 0, paddingLeft: 20 }} onChangeText={chg} value={val} />}
                {datePicVis &&
                    <DateSelector dateDispController={showDate} dateDispControl={() => { setShowDate(true) }} onChangeAction={handleDateChange} inText={dispDate} />
                }
                {
                    datePicVis2 &&
                    <DateSelector dateDispController={showDate2} dateDispControl={() => { setShowDate2(true) }} onChangeAction={handleDateChange2} inText={dispDate2} />
                }
                {genChoice &&
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={styleSheet.genSelect} onPress={() => { setStuGen('Male') }}><Text>Male</Text></TouchableOpacity>
                        <TouchableOpacity style={styleSheet.genSelect} onPress={() => { setStuGen('Female') }}><Text>Female</Text></TouchableOpacity>
                        <Text style={{ marginRight: 20, width: 65, color: 'black' }}>{stuGen}</Text>
                    </View>
                }
            </View >
        )
    }


    let ref = firestore().collection('students');

    const saveStudent = () => {
        // save the student here
        ref.add({
            regNum: regno,
            regDate: regDate,
            name: stuName,
            dob: stuDob,
            gender: stuGen,
            fatherName: stuFName,
            caste: stuCaste,
            occupation: stuOcc,
            residence: stuRes,
            class: stuClass,
            email: stuEmail,
            password: stuPass,
            remarks: stuRem
        });

        navigation.navigate('Home');
    }

    return (
        <ScrollView style={{ backgroundColor: 'lightgray' }} >
            <View style={{ justifyContent: 'center', backgroundColor: "white", margin: 5, padding: 10, paddingVertical: 20, borderRadius: 40, margin: 7 }}>
                <Text style={{ alignSelf: 'center', color: 'black', fontSize: 20, fontWeight: 'bold', margin: 10 }}>Enter values for New Student</Text>
                <InputPlace labelText='Registration No.' phForTi="eg. FA/SP00-BCS-000" chg={(n) => setRegno(n)} val={regno} />
                <InputPlace labelText={"Registration Date"} texVis={false} datePicVis={true} />
                <InputPlace labelText={"Name"} phForTi={"student's name"} chg={(n) => { setStuName(n) }} val={stuName} />
                <InputPlace labelText={"Date of Birth"} phForTi={"date of birth"} texVis={false} datePicVis2={true} />
                <InputPlace labelText={"Gender"} phForTi={'add binary picker here?'} genChoice={true} texVis={false} chg={(n) => { setStuGen(n) }} val={stuGen} />
                <InputPlace labelText={"Father's Name"} phForTi={"full name"} chg={(n) => { setStuFName(n) }} val={stuFName} />
                <InputPlace labelText={"Caste"} phForTi={"any caste"} chg={(n) => { setStuCaste(n) }} val={stuCaste} />
                <InputPlace labelText={"Occupation"} phForTi={'fathers current workplace'} chg={(n) => { setStuOcc }} val={stuOcc} />
                <InputPlace labelText={"Residence"} phForTi={'in any format'} chg={(n) => { setStuRes }} val={stuRes} />
                <InputPlace labelText={'Current Class'} phForTi={'picker'} chg={(n) => { setStuClass }} val={stuClass} />
                <InputPlace labelText={'Email'} phForTi={'student@gmail.com'} chg={(n) => { setStuEmail }} val={stuEmail} />
                <InputPlace labelText={'Password'} phForTi={'set password'} chg={(n) => { setStuPass }} />
                <InputPlace labelText={'Remarks'} phForTi={'optional'} chg={(n) => { setStuRemarks }} val={stuRem} />
                <TouchableOpacity style={{ backgroundColor: 'lightblue', padding: 20, borderRadius: 15, margin: 10, alignItems: 'center' }} onPress={saveStudent} >
                    <Text style={{ color: 'white' }}>
                        Save this Student
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const ChangeScreen = ({ navigation }) => {
    const route = useRoute();

    // where values are being set, and set them using the 
    const [stuname, setStuName] = useState(route.params.name);
    const [sturegNum, setStuRegNum] = useState(route.params.regNum);
    const [sturegDate, setRegDate] = useState(route.params.regDate);
    const [stuDob, setStuDob] = useState(route.params.dob);
    const [stuGen, setStuGen] = useState(route.params.gender);
    const [stuFName, setStuFName] = useState(route.params.fatherName);
    const [stuCaste, setStuCaste] = useState(route.params.caste);
    const [stuOcc, setStuOcc] = useState(route.params.occupation);
    const [stuRes, setStuRes] = useState(route.params.residence);
    const [stuClass, setStuClass] = useState(route.params.class);
    const [stuEmail, setStuEmail] = useState(route.params.email);
    const [stuPass, setStuPass] = useState(route.params.password);
    const [stuRem, setStuRemarks] = useState(route.params.remarks);

    let idOfDoc = route.params.id;
    let ref = firestore().collection('students');

    async function updValuesOfDoc() {
        // updObj.name = name;
        await ref.doc(route.params.id).update(
            // put the update object here
            {
                name: stuname ? stuname : "",
                caste: stuCaste ? stuCaste : "",
                class: stuClass ? stuClass : "",
                dob: stuDob ? stuDob : "",
                email: stuEmail ? stuEmail : "",
                fatherName: stuFName ? stuFName : "",
                gender: stuGen ? stuGen : "",
                occupation: stuOcc ? stuOcc : "",
                password: stuPass ? stuPass : "",
                regDate: sturegDate ? sturegDate : "",
                regNum: sturegNum ? sturegNum : "",
                residence: stuRes ? stuRes : "",
                remarks: stuRem ? stuRem : ""

            }
        )
            .then(() => {
                console.log("The document was successfully updated!");
            })
    }

    // we have hard coded the fields
    async function getFields() {
        let smData = await ref.doc(idOfDoc).get().then((docSnap) => {
            let docData = docSnap.data();
            // console.log("This is the doc data: ", docData);
            // we need to know the field, else hardcode it
        });
    }

    const FieldToChange = ({ vt, onChg }) => {
        return (
            <View>
                <TextInput value={vt} style={{ width: 120, borderRadius: 20, borderWidth: 1, borderColor: "black", color: 'black' }} onChangeText={onChg} />
            </View>
        )
    }

    const FieldCont = ({ vt, onChg, fieldName }) => {
        return (
            <View style={{ marginHorizontal: 10, padding: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                <Text style={styleSheet.blktxt}>{fieldName}</Text>
                <FieldToChange vt={vt} onChg={onChg} />
            </View>
        )
    }

    return (
        <ScrollView style={{ backgroundColor: 'lightgray', height: 100 }}>
            <View style={{ backgroundColor: 'white', margin: 20, borderRadius: 20, padding: 20 }}>
                <FieldCont fieldName={"Name:"} vt={stuname} onChg={setStuName} />
                <FieldCont fieldName={"Registration Number:"} vt={sturegNum} onChg={setStuRegNum} />
                <FieldCont fieldName={"Class:"} vt={stuClass} onChg={setStuClass} />
                <FieldCont fieldName={"Fathername:"} vt={stuFName} onChg={setStuFName} />
                <FieldCont fieldName={"Caste:"} vt={stuCaste} onChg={setStuCaste} />
                <FieldCont fieldName={"Occupation:"} vt={stuOcc} onChg={setStuOcc} />
                <FieldCont fieldName={"Residence:"} vt={stuRes} onChg={setStuRes} />
                <FieldCont fieldName={"Gender:"} vt={stuGen} onChg={setStuGen} />
                <FieldCont fieldName={"Email:"} vt={stuEmail} onChg={setStuEmail} />
                <FieldCont fieldName={"Password:"} vt={stuPass} onChg={setStuPass} />
                <FieldCont fieldName={"Date of Birth:"} vt={stuDob} onChg={setStuDob} />
                <FieldCont fieldName={"Date of Registration:"} vt={sturegDate} onChg={setRegDate} />
                <FieldCont fieldName={"Remarks:"} vt={stuRem} onChg={setStuRemarks} />
                <View>
                    <Button title="Save Updates" onPress={updValuesOfDoc} />
                </View>
            </View>

        </ScrollView>
    )
}

const UpdateDataScreen = ({ navigation }) => {

    const route = useRoute();
    const [data, setData] = useState('');


    const ref = firestore().collection('students');

    const [docArr, setDocArr] = useState([]);
    useEffect(() => {
        getAllDocs();
    }, []);


    class docSchema {
        constructor(id, name, regDate, dob, gender, fatherName, caste, occupation, residence, clss, email, password, remarks) {
            this.id = id ? id : 1001;
            this.name = name ? name : 'none';
            this.regDate = regDate ? regDate : 'none';
            this.dob = dob ? dob : 'none';
            this.gender = gender ? gender : 'none';
            this.fatherName = fatherName ? fatherName : 'none';
            this.caste = caste ? caste : 'none';
            this.occupation = occupation ? occupation : 'none';
            this.residence = residence ? residence : 'none';
            this.class = clss ? clss : 'none';
            this.email = email ? email : 'none';
            this.password = password ? password : '0';
            this.remarks = remarks ? remarks : 'none';
        }
    }

    async function deleteDoc(idToDelete) {
        await ref.doc(idToDelete).delete().then(() => {
            console.log("The document was deleted!");
        })

        // getAllDocs();
    }

    async function getAllDocs() {
        // this code was referenced from the documentation

        let limit = 0;

        await ref.get().then((querySnapshot) => { // to execute the collection getting, use get() and use the data recieved in form of querySnapshot
            console.log('Total docs: ', querySnapshot.size);
            let tempArr = [];
            if (querySnapshot.size != 0 && limit < 10) {
                querySnapshot.forEach(docSnap => {
                    console.log('DocId: ', docSnap.id, docSnap.data().name);
                    let newObj = new docSchema(docSnap.id, docSnap.data().name, docSnap.data().regDate, docSnap.data().dob, docSnap.data().gender, docSnap.data().fatherName, docSnap.data().caste, docSnap.data().occupation, docSnap.data().residence, docSnap.data().class, docSnap.data().email, docSnap.data().password, docSnap.data().remarks);
                    tempArr = tempArr.concat(newObj);
                    setDocArr(tempArr);
                    console.log("This is the tempArr now: ", tempArr);
                    limit++;
                });
            }
            else {
                setDocArr(tempArr);
            }

        });
    } //this gives us all the docs

    const CustomBtn = ({ inText, onPres }) => {
        return (
            <TouchableOpacity onPress={onPres} style={{ padding: 15, margin: 5, backgroundColor: 'lightblue', borderRadius: 10 }}>
                <Text style={{ color: 'white' }}>{inText}</Text>
            </TouchableOpacity>
        )
    }

    const renderItem = ({ id, name, regNum, caste, _class, dob, email, fatherName, gender, occupation, password, regDate, remarks, residence }) => {
        return (
            <View key={id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderRadius: 20, borderColor: 'lightblue', margin: 10, marginLeft: 20, padding: 30 }}>
                <Text style={{ fontSize: 20, width: 135, height: 30, color: 'black' }}>
                    {name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* we will send all the things from the doc that we got from the db, to the change page so the values can be displayed */}
                    <CustomBtn inText={"Update"} onPres={() => navigation.navigate('Change', { name: name, id: id, regNum: regNum, caste: caste, class: _class, dob: dob, email: email, fatherName: fatherName, gender: gender, occupation: occupation, password: password, regDate: regDate, remarks: remarks, residence: residence })} />
                    <CustomBtn inText={"Delete"} onPres={() => deleteDoc(id)} />
                </View>
            </View>
        )
    }

    return (
        <View>

            {/* <FlatList renderItem={renderItem} data={docArr} /> */}
            <ScrollView>
                {
                    docArr.map((doc) => {
                        return (
                            <View key={doc.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderRadius: 20, borderColor: 'lightblue', margin: 10, marginLeft: 20, padding: 30 }}>
                                <Text style={{ fontSize: 20, width: 135, height: 30, color: 'black' }}>
                                    {doc.name}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {/* we will send all the things from the doc that we got from the db, to the change page so the values can be displayed */}
                                    <CustomBtn inText={"Update"} onPres={() => navigation.navigate('Change', { name: doc.name, id: doc.id, regNum: doc.regNum, caste: doc.caste, class: doc.class, dob: doc.dob, email: doc.email, fatherName: doc.fatherName, gender: doc.gender, occupation: doc.occupation, password: doc.password, regDate: doc.regDate, remarks: doc.remarks, residence: doc.residence })} />
                                    <CustomBtn inText={"Delete"} onPres={() => deleteDoc(doc.id)} />
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
                    <TouchableOpacity onPress={quickLogin} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'inherit' }}>
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

const StuLogin = ({ navigation }) => {


    const [email, setEmail] = useState('malik@786.com');
    const [pass, setPass] = useState('123456789');
    const quickLogin = () => {
        setEmail('malik@786.com');
        setPass('123456789');
        console.log("Values were automatically filled in using quick-login.");
    }

    useEffect(() => {   // this one checks the auth state and navigates to the home page of the admin
        const unsub = auth().onAuthStateChanged(
            user => {
                if (user) {
                    navigation.replace('Student Home');
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
                    <TouchableOpacity onPress={quickLogin} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'inherit' }}>
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

const DataScreen = () => {

    let ref = firestore().collection('students');


    let jsonFile = require('./jsons/data.json');
    // let objVer = JSON.parse(jsonFile.toString());

    class student {
        constructor(name, fatherName, caste, clss, dob, regDate, gender, occupation, residence, email, password, regNum, remarks) {
            this.name = name;
            this.fatherName = fatherName;
            this.caste = caste;
            this.class = clss;
            this.dob = dob;
            this.regDate = regDate;
            this.gender = gender;
            this.occupation = occupation;
            this.residence = residence;
            this.email = email;
            this.password = password;
            this.regNum = regNum;
            this.remarks = remarks;
        }
    }


    function addDataFunc() {

        console.log(jsonFile[0])
        console.log(jsonFile[0].caste);
        for (let i = 0; i < 200; i++) {
            let newStud = new student(jsonFile[i].name, jsonFile[i].fatherName, jsonFile[i].caste, jsonFile[i].class, jsonFile[i].dob, jsonFile[i].regDate, jsonFile[i].gender, jsonFile[i].occupation, jsonFile[i].occupation, jsonFile[i].residence, jsonFile[i].email, jsonFile[i].password, jsonFile[i].regNum, jsonFile[i].remarks);
            ref.add(newStud);
            console.log('Done');
        }
    }

    return (
        <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
            <Button title='Add Data' onPress={addDataFunc} />
        </View>
    )
}

const FeeManage = () => {

    useEffect(() => {
        getAllDocs();
        getAllDocs1();
    }, []);


    const [amountPaid, setAmountPaid] = useState('');
    const [amountDue, setAmountDue] = useState('');
    const [payableAmount, setPayableAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [remarks, setRemarks] = useState('');


    const [feeInteractMode, setFeeInteractMode] = useState('none')

    let ref = firestore().collection('students');
    let ref1 = firestore().collection('studentFees');

    function docSchema(id, name, regNum) {
        this.id = id;
        this.name = name;
        this.regNum = regNum
    }

    function feeSchema(id, name, regNum) {
        this.id = id
        this.name = name;
        this.regNum = regNum;
    }

    // we need to enter a student name first
    const [searchedStd, setSearchedStd] = useState('');
    const [docArr, setDocArr] = useState([]); // all the students are stored here
    const [feeArr, setFeeArr] = useState([]); // all the fees



    // we need to search if this name is present in both places.
    async function getAllDocs() {
        let smData = await ref.get().then((querySnapshot) => {
            // console.log('Total docs: ', querySnapshot.size);
            let tempArr = [];
            querySnapshot.forEach(docSnap => {
                // console.log('DocId: ', docSnap.id, docSnap.data().name);
                let newObj = new docSchema(docSnap.data().name, docSnap.data().regNum);
                tempArr = tempArr.concat(newObj);
                setFeeArr(tempArr);
                // console.log("This is the tempArr now: ", tempArr);
            });

        });

        console.log(docArr)
    }

    async function getAllDocs1() {
        let smData = await ref1.get().then((querySnapshot) => {
            // console.log('Total docs: ', querySnapshot.size);
            let tempArr = [];
            querySnapshot.forEach(docSnap => {
                // console.log('DocId: ', docSnap.id, docSnap.data().name);
                let newObj = new feeSchema(docSnap.id, docSnap.data().name, docSnap.data().regNum);
                tempArr = tempArr.concat(newObj);
                setDocArr(tempArr);
                // console.log("This is the tempArr now: ", tempArr);
            });

        });

        console.log(feeArr);
    }

    function refresh() {
        getAllDocs();
        getAllDocs1();
    }

    function search() {

        let found = false;
        let foundRegNum = -1;
        docArr.map((doc) => {
            console.log(doc.name);
            if (doc.name === searchedStd) {
                console.log('Found');
                foundRegNum = doc.regNum;
                found = true;
            }
        });

        let feeFound = false;
        feeArr.map((fee) => {
            if (fee.name === searchedStd) {
                feeFound = true;
            }
        })

        // we have found the registration number too, so we can update their fee status now, if exists otherwise create it CRUD

        if (found && !feeFound) {
            // create a feeStatus
            setFeeInteractMode('create');
        }

        if (found && feeFound) {

            //we can update the fee that exists
            setFeeInteractMode('update')

        }

        console.log('User exists in students ', found);

    }

    const ValueField = ({ fieldName, onChg }) => {
        return (
            <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 20, margin: 10, padding: 5, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row' }}>
                <Text style={styleSheet.blktxt}>{fieldName}</Text>
                <TextInput style={{ color: 'black', borderRadius: 20, borderWidth: 1, borderColor: 'lightgray', width: 130 }} onChangeText={onChg} />
            </View>
        )
    }

    return (
        <ScrollView style={{ backgroundColor: 'lightgray' }}>
            <View style={{ margin: 30, backgroundColor: 'white', borderRadius: 30, padding: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Text style={styleSheet.blktxt}>Search Student</Text>
                    <TextInput style={{ color: 'black', borderWidth: 1, borderColor: 'lightgray', borderRadius: 10 }} placeholder={'Search for student'} onChangeText={setSearchedStd} />
                </View>
                <TouchableOpacity onPress={search} style={{ backgroundColor: 'lightblue', margin: 10, padding: 10, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styleSheet.blktxt}>
                        Search
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={refresh} style={{ backgroundColor: 'lightblue', margin: 10, padding: 10, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styleSheet.blktxt}>
                        Refresh
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ margin: 30, backgroundColor: 'white', borderRadius: 30, padding: 10 }}>
                {feeInteractMode === 'create' && <View>
                    <Text style={{ color: 'black', margin: 10, fontSize: 19 }}>Create a Fee Status</Text>
                    <ValueField fieldName={"Amount Due"} onChg={setAmountDue} />
                    <ValueField fieldName={"Amount Paid"} onChg={setAmountPaid} />
                    <ValueField fieldName={"Payable Amount"} onChg={setPayableAmount} />
                    <ValueField fieldName={"Remarks"} onChg={setRemarks} />
                </View>}
            </View>
        </ScrollView>
    )
}

const App = () => {

    return (
        <NavigationContainer>
            <StatusBar />
            {/* <Stack.Navigator initialRouteName="Data" > */}
            <Stack.Navigator initialRouteName="Choose Login" >
                <Stack.Screen name="Fee Manage" component={FeeManage} />
                <Stack.Screen name="Data" component={DataScreen} />
                <Stack.Screen name='Choose Login' component={Logins} options={{ headerTitle: 'School Management App' }} />
                <Stack.Screen name='Admin Login' component={AdmLogin} />
                <Stack.Screen name="Student Login" component={StuLogin} />
                <Stack.Screen name="Teacher Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerTitle: 'Welcome to Admin Homepage!', headerBackVisible: false, gestureEnabled: false }} />
                <Stack.Screen name="Student Home" component={StuHome} />
                <Stack.Screen name='Teacher Home' component={DashboardScreen} />
                <Stack.Screen name='Teacher Marks Screen' component={ViewMarksScreen} />
                <Stack.Screen name="Marks Screen" component={MarkScreen} />
                <Stack.Screen name='Add Student' component={AddStdScreen} />
                <Stack.Screen name="Add Data" component={AddDataScreen} />
                <Stack.Screen name="Update Data" component={UpdateDataScreen} />
                <Stack.Screen name="Change" component={ChangeScreen} />
                <Stack.Screen name="Manage Timetable" component={ManageTimetable} />
                <Stack.Screen name='Manage Syllabus' component={ManageSyllabus} />
                <Stack.Screen name='View Timetable' component={Viewtimetable} />

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
    },
    blktxt: {
        color: 'black'
    },
    genSelect: {
        margin: 10,
        padding: 10,
        borderRadius: 20,
        backgroundColor: 'lightblue'
    }

})


const DashboardScreen = ({ navigation }) => {
    const tableData = [
        { reg_no: 'FA21-BCS-031', name: 'John Doe' },
        { reg_no: 'FA21-BCS-031', name: 'Jane Smith' },
        { reg_no: 'FA21-BCS-031', name: 'Sam Johnson' },
        { reg_no: 'FA21-BCS-031', name: 'Chris Lee' }
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.row}>
                <Text style={[styles.cell, styles.header]}>Registration No.</Text>
                <Text style={[styles.cell, styles.header]}>Name</Text>
                <Text style={[styles.cell, styles.header]}>Marks</Text>
            </View>
            {tableData.map((item, index) => (
                <View key={index} style={styles.row}>
                    <Text style={styles.cell}>{item.reg_no}</Text>
                    <Text style={styles.cell}>{item.name}</Text>
                    <TouchableOpacity style={styles.view} onPress={() => navigation.navigate('Teacher Marks Screen')}>
                        <Text>View Marks</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
};

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Implement login functionality here
        // Navigate to Dashboard on successful login
        navigation.navigate('Teacher Home');
    };

    return (
        <View>
            <Text style={{ color: 'black', margin: 15 }}>Email:</Text>
            <TextInput
                style={{ backgroundColor: 'white', width: 300, marginLeft: 10, borderRadius: 50, color: 'black' }}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
            />
            <Text style={{ color: 'black', margin: 15 }}>Password:</Text>
            <TextInput
                style={{ backgroundColor: 'white', width: 300, marginLeft: 10, marginBottom: 10, borderRadius: 50, color: 'black' }}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>

    );
};

const ViewMarksScreen = () => {
    const tableData = [
        { subject: 'Mathematics', firstTerm: 85, midTerm: 88, finals: 90 },
        { subject: 'Physics', firstTerm: 78, midTerm: 82, finals: 85 },
        { subject: 'Chemistry', firstTerm: 80, midTerm: 84, finals: 88 },
        { subject: 'Biology', firstTerm: 90, midTerm: 92, finals: 94 },
        { subject: 'History', firstTerm: 75, midTerm: 78, finals: 80 },
        // Add more rows as needed
    ];

    const [marks, setMarks] = useState('');

    return (
        <ScrollView style={styles.container}>
            <View style={styles.row}>
                <Text style={[styles.cell, styles.header]}>Subject/</Text>
                <Text style={[styles.cell, styles.header]}>First Term</Text>
                <Text style={[styles.cell, styles.header]}>Mid Term</Text>
                <Text style={[styles.cell, styles.header]}>Finals</Text>
            </View>
            {tableData.map((item, index) => (
                <View key={index} style={styles.row}>
                    <Text style={styles.cell}>{item.subject}</Text>
                    <TextInput style={styles.cell} value={index.marks} onChangeText={index.setMarks} />
                    <TextInput style={styles.cell} value={index.marks} onChangeText={index.setMarks} />
                    <TextInput style={styles.cell} value={index.marks} onChangeText={index.setMarks} />
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    cell: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#dcdcdc',
        paddingHorizontal: 15,
        textAlign: 'center',
        color: 'black'
    },
    header: {
        backgroundColor: '#eaeaea',
        fontWeight: 'bold',
        color: 'black'
    },
    view: {
        backgroundColor: '#2196F3',
        flex: 1,
        borderWidth: 1,
        borderColor: '#dcdcdc',
        paddingHorizontal: 15,
        paddingVertical: 5,
        textAlign: 'center',
        color: 'black'
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        width: '20%',
        marginLeft: 15,
        marginTop: 10
    }
});

export default App;


