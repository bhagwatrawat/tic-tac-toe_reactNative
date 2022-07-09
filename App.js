/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React ,{useEffect, useState} from 'react';
import bg from './assests/bg.jpeg'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ImageBackground,
  Pressable,
  Alert
} from 'react-native';

export default function App(){
  const [map,setMap]=useState(
    [
      ['','',''],
      ['','',''],
      ['','',''],
    ]
  )
  const [currentTurn,setCurrentTurn]=useState('x')
  const [gameMode,setGameMode]=useState('LOCAL');
  useEffect(()=>{
    if(currentTurn==='o' && gameMode!=='LOCAL'){
      botTurn();
    }
  },[currentTurn,gameMode])
  useEffect(()=>{
    const checkwon=checkWinning(map);
    if(checkwon){
      gameWon(checkwon);
      setCurrentTurn('x');
    }
    else{
      checkTie()
    }
  },[map])
  const copyArray=(original)=>{
    const copy=original.map((arr)=>{
      return arr.slice();
    })
    return copy;
    
  }
  const onPress=(i1,i2)=>{
    if(map[i1][i2]!==''){
      Alert.alert('Position Already Occupied')
      return
    }
    setMap((existingMap)=>{
      const updatedMap= [...existingMap]
      updatedMap[i1][i2]=currentTurn
      return updatedMap
    })
    setCurrentTurn(currentTurn==='x'?'o':'x')
  }
  const checkWinning=(winnerMap)=>{
    // for rows 
    for(let i=0;i<3;i++){
      const rowowinning= winnerMap[i].every(cell=>cell==="o");
      const rowxwinning= winnerMap[i].every(cell=>cell==="x");
      if(rowowinning){
        return 'o'
      }
      if(rowxwinning){
        return 'x'
      }
    }

    // for columns
    for(let col =0;col<3;col++){
      let colowinning= true;
      let colxwinning= true;
      for (let row = 0 ;row <3;row++){
        if(winnerMap[row][col]!=='o'){
          colowinning=false;
        }
        if(winnerMap[row][col]!=='x'){
          colxwinning=false;
        }
      }
      if(colowinning){
        return 'o'
      }
      if(colxwinning){
        return 'x'
      }
    }
    // for diagonals
    let dia1owinning=true;
    let dia1xwinning=true;
    let dia2owinning=true;
    let dia2xwinning=true;

    for(let i=0;i<3;i++){
      if(winnerMap[i][i]!=='o'){
        dia1owinning=false;
      }
      if(winnerMap[i][i]!=='x'){
        dia1xwinning=false;
      }
      if(winnerMap[i][3-i-1]!=='o'){
        dia2owinning=false;
      }
      if(winnerMap[i][3-i-1]!=='x'){
        dia2xwinning=false;
      }
    }
    if(dia1owinning){
      return 'o'
    }
    if(dia1xwinning){
      return 'x'    } 
    if(dia2owinning){
      return 'o'
    } 
    if(dia2xwinning){
      return 'x'    }
  }
  const checkTie=()=>{
    if(!map.some(row=>row.some(cell=>cell===''))){
      Alert.alert('Tie',`This game is a Tie`,[{
        text:'New Game',
        onPress:resetGame
      }])
    }
  }
  const resetGame=()=>{
    setMap( [
      ['','',''],
      ['','',''],
      ['','',''],
    ])
    setCurrentTurn('x');
  }
  const gameWon=(player)=>{
    Alert.alert('Hurray',`Player ${player.toUpperCase()} won`,[{
      text:'New Game',
      onPress:resetGame
    }])
  }
  const botTurn=()=>{
    // collect all possible options
    const possiblePositions=[];
    map.forEach((row,rowIndex)=>{
      row.forEach((cell,colIndex)=>{
      if(cell===''){
        possiblePositions.push({
          row:rowIndex,
          col:colIndex
        })
      }
    })})
    let randomOption;
    

    // attack
    // if bot can win 
    if(gameMode==="MEDIUM"){ 
    possiblePositions.forEach(possiblePosition=>{
      const mapCopy=copyArray(map);
      mapCopy[possiblePosition.row][possiblePosition.col]='o';
      
      const winner=checkWinning(mapCopy);
      if(winner==='o'){
        randomOption=possiblePosition;
      }
    })
    // defend
    // check if the opponent wins if it takes any of the possible positions
    if(!randomOption){
      possiblePositions.forEach(possiblePosition=>{
        const mapCopy=copyArray(map);
        console.log(mapCopy)
        mapCopy[possiblePosition.row][possiblePosition.col]='x';
        
        const winner=checkWinning(mapCopy);
        if(winner==='x'){
          randomOption=possiblePosition;
        }
      })
  
    }
  }
    // select a random option
    if(!randomOption){
      randomOption= possiblePositions[Math.floor(Math.random() * possiblePositions.length)]
    }
    if(randomOption){
      onPress(randomOption.row,randomOption.col);
    }

    
  }
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.bg}  source={bg} resizeMode="contain">
        <Text style={
          {fontSize:24,
          color:'white',
          position:'absolute',
          top:50,
          }}>Current Turn : {currentTurn.toUpperCase()}</Text>
        <View style={styles.map}>
          {
            map.map((row,i1)=> 
              <View key={`row-${i1}`}  style={styles.row}>
                 {row.map((cell,i2)=><Pressable key={`row-${i1}-col-${i2}`} onPress={()=>onPress(i1,i2)} style={styles.cell}>
                  {cell==='o'&&<View style={styles.circle}/> }
                  {cell==='x' && 
                    <View style={styles.cross}> 
                      <View style={styles.crossLine}/>
                      <View style={[styles.crossLine,styles.crossLine2]}/>
                    </View>}
                 </Pressable>)}
              </View>
             
          )}
          {/* <View style={styles.circle}/> */}
          {/* <View style={styles.cross}>
            <View style={styles.crossLine}/>
            <View style={[styles.crossLine,styles.crossLine2]}/>
          </View> */}
        </View>
        <View style={styles.buttons}>
          <Text
            onPress={()=>setGameMode("LOCAL")}
           style={[styles.button,
            {backgroundColor:gameMode==="LOCAL"?"#484E3A":'#1C4F69'}]}>LOCAL</Text>
          <Text 
          onPress={()=>setGameMode("EASY")}
          style={[styles.button,
            {backgroundColor:gameMode==="EASY"?"#484E3A":'#1C4F69'}]}>EASY_BOT</Text>
          <Text
          onPress={()=>setGameMode("MEDIUM")}
          style={[styles.button,
            {backgroundColor:gameMode==="MEDIUM"?"#484E3A":'#1C4F69'}]}>MEDIUM_BOT</Text>
        </View>
      </ImageBackground>
      
    </View>
  )
}
const styles= StyleSheet.create({
  container:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#242D34"
  },
  map:{
    borderWidth:2,
    borderColor:'white',
    width:'85%',
    aspectRatio:1,
  },
  cross:{
    width:75,
    height:75,
  },
  cell:{
    flex:1,
    
  },
  buttons:{
    position:'absolute',
    bottom:50,
    flexDirection:'row',
  },
  button:{
    color:"white",
    margin:10,
    fontSize:20,
    backgroundColor:'#1C4F69',
    padding:10
  },
  row:{
    flex:1,
    flexDirection: 'row',
  },
  bg:{
    width:'100%',
    height:'100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:19,
  },
  circle:{
    width:75,
    height:75,
    borderRadius:50,
    borderWidth:10,
    borderColor:'white',
    margin:17,
  },
  crossLine:{
    marign:10,
    position:'absolute',
    left:50,
    top:19,
    width:10,
    height:75,
    backgroundColor:'white',
    transform:[
      {
        rotate:'45deg'
      }
    ]
  },
  crossLine2:{
    transform:[
      {
        rotate:'-45deg'
      }
    ]
  }
})