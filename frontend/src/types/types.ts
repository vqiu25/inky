export type Player = {
  playerName: string;
  playerProfile: string;
};

export interface AppContextType {
  playersList: Player[];
  setPlayersList: React.Dispatch<React.SetStateAction<Player[]>>;
}
