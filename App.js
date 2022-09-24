import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "./color";
import { Fontisto } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";
const STATE_KEY = "@working";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadToDos();
    loadState();
  }, []);

  const saveState = async (saveWork) => {
    await AsyncStorage.setItem(STATE_KEY, JSON.stringify(saveWork));
  };

  const loadState = async () => {
    const v = await AsyncStorage.getItem(STATE_KEY);
    setWorking(JSON.parse(v));
  };

  // Work / Travel 섹션 기억하기 (boolean)

  console.log("log out please ");

  const travel = () => {
    setWorking(false);
    saveState(false);
  };
  const work = () => {
    setWorking(true);
    saveState(true);
  };

  // 여기 있는 함수를 이용해야한다.

  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    // stringfy = object => string
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    s !== null ? setToDos(JSON.parse(s)) : null;
    // parse = string => object
    // 처음에 입력값이 없을 때 Object.keys(toDos)에서 에러가 발생해서 수정함
  };

  // persist in storage

  //setItem은 Promise return

  const addToDo = async () => {
    if (text === "") {
      return;
    }
    // save to do
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: { text, working },
      // 3개의 object를 결합하기 위한 object assign
      // 첫 번째 {} = target Object
      // 그 다음 이전 toDo를 새로운 toDo로 합침
    });

    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
    // 리셋
  };
  console.log(toDos);

  // Alternative Version =  Object assign이 어렵다면? => spread 연산자를 쓰자
  // const newToDos = {
  //   ...toDos,
  //   [Date.now()]: { text, work: working },
  // };
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm sure",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          // delete 연산자 : 객체의 속성을 제거
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
    return;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          returnKeyType="done"
          value={text}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
          style={styles.input}
        />
        <ScrollView>
          {/* Object.keys() : 객체의 Key값만 가져오는 것 */}
          {Object.keys(toDos).map((key) =>
            toDos[key].working === working ? (
              // 현재 스테이트랑 toDos[key].working이 일치하는 것만 보여줌
              <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity
                  onPress={() => {
                    deleteToDo(key);
                  }}
                >
                  <Fontisto name="trash" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
    marginVertical: 20,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
});
