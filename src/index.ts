import * as CryptoJS from "crypto-js";

class Block {
    static calculateBlockHash = (index:number, previousHash:string, timestamp:number, data:string) :string =>
        CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
    
    static validateStructure = (aBlock:Block) : boolean => 
        typeof aBlock.index === "number" &&
        typeof aBlock.hash === "string" &&
        typeof aBlock.previousHash === "string" &&
        typeof aBlock.timestamp === "number" &&
        typeof aBlock.data === "string";
    
    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    constructor(index: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number
    ){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this. timestamp = timestamp;
    }
}


// 테스트용 첫번째 블록 생성
const genesisBlock:Block = new Block(0, "202020202020", "", "hello", 123456);
let blockChain: Block[] = [genesisBlock];


// 블록체인의 길이 ( 블록체인 내의 가장 최근 데이터를 불러 옴 )
const getLatestBlock = () :Block => blockChain[blockChain.length - 1];

// 블록의 생성 시간
const getNewTimeStamp = ():number => Math.round(new Date().getTime() / 1000);

// 블록 생성
const createNewBlock = (data:string):Block => {
    const previousBlock : Block = getLatestBlock();
    const newIndex :number = previousBlock.index + 1;
    const newTimeStamp :number = getNewTimeStamp();
    const newHash :string = Block.calculateBlockHash(newIndex, previousBlock.hash, newTimeStamp, data);

    const newBlock :Block = new Block(newIndex, newHash, previousBlock.hash, data, newTimeStamp);
    addBlock(newBlock);

    return newBlock;
}

// 블럭의 해쉬 데이터를 가져 옴
const getHashforBlock = (aBlock:Block):string =>
    Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);

// 블록 데이터 유효성 검사
const isBlockValid = (candidateBlock:Block, previousBlock:Block):boolean => {
    
    // 블록 형식 검사
    if(!Block.validateStructure(candidateBlock)) {
        return false;
    }

    // 각 블록의 index 값 검사
    else if(previousBlock.index + 1 !== candidateBlock.index) {
        return false;
    }

    // Chain prevHash 값 검사
    else if(previousBlock.hash !== candidateBlock.previousHash) {
        return false;
    }

    // 해쉬 값 검사
    else if(getHashforBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    }
    else {
        return true;
    }
}

const addBlock = (candidateBlock:Block):void => {
    if(isBlockValid(candidateBlock, getLatestBlock())) {
        blockChain.push(candidateBlock);
    }
}

createNewBlock("secondBlock");
createNewBlock("thirdBlock");
createNewBlock("fourthBlock");

console.log(blockChain);

export {}