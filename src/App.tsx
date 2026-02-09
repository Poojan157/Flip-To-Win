import { useState } from 'react';
import styles from './App.module.css';

type symbols = '💎' | '🔥' | '⚡' | '🍀' | '👑' | '🔮' | '🛸' |'🌈';

const App = () => {
  const [score1,setScore1] = useState<number>(0);
  const [score2,setScore2] = useState<number>(0);
  const myArray: symbols[] = ['💎', '🔥', '⚡', '🍀', '👑', '🔮', '🛸', '🌈'];
  return (
    <div>
      <header className={styles['header']}>Flip Two Win !</header>
      <div className={styles['grid']}>
        <div className={styles['player-container']}>
          <div className={styles['player']}>Player 1 : {score1}</div>
        </div>
        <div className={styles['card-grid-container']}>
          {
            myArray.map((symbol,index)=>{
              return <ol style={{backgroundColor : 'aliceblue', display : "flex", justifyContent : "center",alignItems : "center"}} key = {index}>{symbol}</ol>
            })
          }
          {
            myArray.map((symbol,index)=>{
              return <ol style={{backgroundColor : 'aliceblue', display : "flex", justifyContent : "center",alignItems : "center"}} key = {index}>{symbol}</ol>
            })
          }
        </div>
         <div className={styles['player-container']}>
          <div className={styles['player']}>Player 2 : {score2}</div>
        </div>
      </div>
    </div>
  )
}

export default App;