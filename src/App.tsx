import styles from './App.module.css';
import { useEffect, useState, type TransitionEventHandler } from 'react';

type symbols = "🌸" | "🐉" | "🚀" | "🎨" | "🍩" | "🏝️" | "🦋" | "🎁";

interface Card{
  symbol : string,
  isFlipped : boolean,
  isFound : boolean
}

// Using Fihser-Yates algorithm to generate the random permutation of cards
function fisher_yates() : Card[]{
  const myCards : symbols[]= ["🌸" , "🐉" , "🚀" , "🎨" , "🍩" , "🏝️" , "🦋" , "🎁"];
  const temp_cards : Card[] = [];

  for(let i = 0;i<8;i++){
    temp_cards.push({
      symbol: myCards[i],
      isFlipped: false,
      isFound: false
    })
    temp_cards.push({
      symbol: myCards[i],
      isFlipped: false,
      isFound: false
    })
  }
  
  // fisher-yates algorithm
  for(let i = temp_cards.length-1;i>0;i--){
    let randomIndex : number = Math.floor(Math.random()*(i+1));
    [temp_cards[randomIndex],temp_cards[i]] = [temp_cards[i],temp_cards[randomIndex]];
  }

  return temp_cards;
}


const App = ()=>{
  // Declaring Players names
  const [Player1, setPlayer1] = useState<string>('Player1');
  const [Player2, setPlayer2] = useState<string>("Player2");

  // Declaring the Scores of both the players
  const [score1, setScore1] = useState<number>(0);
  const [score2, setScore2] = useState<number>(0);

  // setting up the game-state
  const [cards, setCards] = useState<Card[]>(()=>{return fisher_yates()});

  // Declaring state to store the player's turn
  const [turn, setTurn] = useState<number>(0);

  // Disable state to disable the clicking.
  const [disable, setDisable] = useState<boolean>(false);

  const found_styles = (card : Card) : string=>{
    // If Card Found then apply these styles below
    if(card.isFound){
      return 'card-found';
    }
    return "";
  }

  const flipped_styles = (card: Card): string=>{
    if(card.isFlipped && !card.isFound){
      return 'card-flipped';
    }
    return "";
  }
  
  const disabled_styles = () : string=>{
    return (disable ? "disable" : '');
  }
  

  const handleClick = (card : Card, index : number)=>{
    // if the card has been found or already flipped then don't do anything.
    if(card.isFlipped || card.isFound){
      return;
    }
    console.log('State updates now');
    // Disable the clicking.
    setDisable(true);
    // change the card state to flipped.
    setCards((prev_cards : Card[])=>{
      return prev_cards.map((value,i)=>{
        if(i === index){
          return {...value,isFlipped:true};
        }
        else{
          return value;
        }
      })
    })
  }


  const handleTransitionEnd : TransitionEventHandler<HTMLDivElement> = ()=>{
    // Event Can be of three types 
    // 1. One Card Flipped 2. Two Card Flipped 3. Two Flipped cards Now flipped back
    
    // Find the non-founded cards which are flipped.
    const flipped_cards = cards.filter((value)=>{
      if(value.isFound){
        return false;
      }
      else if(value.isFlipped){
        return true;
      }
      return false;
    });

    if(flipped_cards.length === 1){
      // Allow the Clicking back once again
      setDisable(false);   
    }

    if(flipped_cards.length === 2){
      if(flipped_cards[0].symbol === flipped_cards[1].symbol){ // card do match
        if(turn == 0){
          setScore1((prev)=>{return prev+1});
        }
        else{
          setScore2((prev)=>{return prev+1});
        }
        setCards((prev_cards)=>{
          return prev_cards.map((value)=>{
            if(value.symbol === flipped_cards[0].symbol){
              return {...value,isFlipped:true,isFound:true};
            }
            return value;
          })
        });
      }
      else{ // Cards did not match, Update the turn, flip the cards back.
        setTurn((prev)=>{return (prev+1)%2});
        setCards((prev_cards)=>{
          return prev_cards.map((value)=>{
            if(value.symbol === flipped_cards[0].symbol || value.symbol === flipped_cards[1].symbol){
              return {...value,isFlipped:false,isFound:false}
            }
            return value;
          })
        })
      }
    }

    if(flipped_cards.length === 0){ // Either it's a flip back animation or Fade away animation
      setDisable(false); // We just have to allow the clicking back and nothing else. So there is no doubt about it ! 
    }
  }

  const resetGame = ()=>{
    setScore1(0);
    setScore2(0);
    setCards(()=>{return fisher_yates();});
    setTurn(0);
    setDisable(false);
  }

  return <div>
  <header className={styles['header']}>Flip Two Win!</header>
    
  <div className={styles['Player']}>
    <div className={turn === 0 ? `${styles['is-your-turn']} ${styles['players-div']}` : styles['players-div']}>{Player1} : {score1}</div>
    <div className={turn === 1 ? `${styles['is-your-turn']} ${styles['players-div']}` : styles['players-div']}>{Player2} : {score2}</div>
  </div>

    <div className={styles['game-grid']}>
      {/* Cards Grid Container */}
      <div 
        className={styles['grid-container']}
        onTransitionEnd={handleTransitionEnd}
      >
        {
          cards.map((value : Card,index : number)=>{
            return (
              <div  key = {index} 
                    className={`${styles['card']} ${styles[found_styles(value)]} ${styles[flipped_styles(value)]} ${styles[disabled_styles()]}`}
                    onClick={()=>{handleClick(value,index);}}
              >
                <div className={styles['card-front']}>{value.symbol}</div>
                <div className={styles['card-back']}></div>
              </div>
            );
          })
        }
      </div>
    </div>
    
    <div className={styles['btn-container']}>
      <button className={styles['reset']} onClick={resetGame} >reset</button>
    </div>

    { score1 + score2 == 8 &&
      <div className={styles['modal']}>
        <div>
          {
            (score1+score2 === 8 && score1 === score2)? `It's A Tie \n Well Played ` : (
              score1 > score2 ? `Hurray! ${Player1} Won\n Congratulations`:`Hurray! ${Player2} Won\n Congratulations`
            )
          }
          <button onClick={()=>{return resetGame();}}>New Game!</button>
        </div>
      </div>
    }
  </div>
}

export default App; 