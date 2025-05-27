# 블록체인 기반 멤버 등급 게시판 시스템

## 프로젝트 개요

이 프로젝트는 DAO(탈중앙화 자율조직)를 고려한 **등급 기반 커뮤니티 게시판** 시스템
사용자는 글을 작성하며 STK 토큰을 보상받고 활동량과 누적 보상에 따라 자동으로 등급이 상승
등급이 오르면 **보상이 증가하고 NFT 뱃지가 발급**
이 NFT는 향후 DAO 투표 권한이나 NFT 마켓 인증 등 다양한 곳에 활용될 수 있음

## 사용자 흐름 (User Flow)

1. 사용자가 Metamask 지갑 연결
2. 글 작성 (0.5 ETH 필요)
3. 글 작성 시 현재 등급에 따라 STK 보상 자동으로 지급
4. 특정 등급 조건을 만족하면 NFT 배지 발급
5. 동일 조건을 반복 충족할 경우 해당 배지는 **누적 발급**

## 사용자 등급 및 STK 보상 구조

| 등급                 | 조건                             | STK 보상 | 배지 ID     |
| -------------------- | -------------------------------- | -------- | ----------- |
| 일반 회원            | 진입 조건 없음                   | 1 STK    | 없음        |
| 우수 회원 (GOOD)     | 글 ≥ 3개 AND STK 보상 ≥ 3 STK    | 2 STK    | badgeId = 0 |
| 최우수 회원 (BEST)   | 글 ≥ 10개 AND STK 보상 ≥ 10 STK  | 10 STK   | badgeId = 1 |
| MVP 회원 (EXCELLENT) | 글 ≥ 20개 AND STK 보상 ≥ 100 STK | 20 STK   | badgeId = 2 |

> 등급은 자동으로 계산되며 글 수와 누적 STK 보상량(totalRewarded)을 기반으로 판단

## 스마트 컨트랙트 제약 사항

- `msg.value == 0.5 ether`일 때만 글 작성 가능
- STK 보상은 `transferFrom(owner → user)` 방식으로 지급
- NFT 발급은 사용자가 `isMember == true`일 경우에만 가능

## 프론트엔드/관리자 기능 목록

### 사용자 화면

- 지갑 연결
  - 지갑 연결 버튼
  - 연결된 지갑 주소 확인
- 글 작성
  - input (내용만)
  - 작성 버튼
- 글 목록
  - 작성자 등급
  - 작성자 EOA
  - 글 내용
- 내 활동 요약
  - EOA 주소
  - 등급
  - 배지 ID
  - 멤버 여부
  - 글 수
  - STK 보상

### 관리자 화면

- 전체 글 목록
  - 작성자 등급
  - 작성자 EOA
  - 글 내용
- 사용자별 활동 내역
  - EOA 주소
  - 등급
  - 배지 ID
  - 멤버 여부
  - 멤버 인증 버튼 (현재는 관리자가 멤버 인증을 해주지만 차후에 사용자가 신청해서 관리자가 허락하는 형태로 변경할 것)
  - 글 수
  - STK 보상
- NFT 발급 내역 확인
  - 사용자 EOA
  - tokenID
- STK 토큰 상태 확인
  - Owner 주소
  - 총 발행량 (totalSupply)
  - 잔고 (BalanceOf)
  - transferFrom 기록 조회

## 기술 스택 및 환경

| 영역            | 기술 스택/환경                            |
| --------------- | ----------------------------------------- |
| 프론트엔드      | React.js, Styled-components               |
| 스마트 컨트랙트 | Solidity, Truffle, OpenZeppelin           |
| 개발 도구       | VS Code, GitHub, Google Sheets            |
| 블록체인        | KAIA 체인 (로컬 테스트 및 실제 배포 고려) |

---

## ERC-1155에 대한 이해와 선택 이유

### 왜 NFT 배지는 ERC-1155을 사용하는가??

ERC-1155는 Ethereum에서 사용하는 **멀티 토큰 표준(Multi Token Standard)**
기존의 ERC-20은 대체 가능한 토큰(FT, Fungible Token), ERC-721은 대체 불가능한 토큰(NFT, Non-Fungible Token)을 위한 것
반면 **ERC-1155는 하나의 컨트랙트에서 둘 모두를 처리할 수 있도록 설계**됨

### 핵심 개념

- 하나의 스마트 컨트랙트로 다양한 토큰 발행 가능 (FT, NFT 혼합)
- 동일한 토큰 ID에 대해 수량 지정 가능
- 대량 전송 및 발급이 효율적 (가스비 절감)
- 게임 아이템, 배지, 포인트 등 복합 토큰 시스템에 적합

### ERC-1155 주요 함수

- `mint(address to, uint256 id, uint256 amount, bytes data)`

  - 특정 주소에게 특정 ID의 토큰을 `amount`만큼 발행

- `balanceOf(address account, uint256 id)`

  - 사용자의 특정 ID 토큰 보유 수량 반환

- `safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)`

  - 특정 ID의 토큰을 안전하게 전송

- `setApprovalForAll(address operator, bool approved)`

  - 위임 권한 설정

### 이 프로젝트에서 ERC-1155가 필요한 이유

| 요구사항                           | ERC-1155로 해결 가능한 이유                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| 동일 배지의 **누적 발급** 필요     | `amount`를 증가시켜 하나의 ID로 여러 개 발급 가능            |
| 등급별 배지 ID 구분 필요           | 각 등급별 배지를 별도의 ID로 구분 가능                       |
| STK 토큰과 NFT 배지 동시 발급 필요 | 하나의 컨트랙트에서 둘 다 관리 가능 (FT와 NFT를 동시에 다룸) |
| 가스 효율성 필요                   | ERC-721보다 저렴한 가스비로 대량 발급 가능                   |

> Ex.

    badgeId = 0번은 GOOD 등급 배지이며 같은 배지를 여러 번 받으면 count 올라감
    ERC-721은 같은 ID의 중복 발급이 불가능하지만 ERC-1155는 이를 `amount`로 표현할 수 있음

---

## 왜 STK 토큰은 ERC-20을 사용하는가?

### STK는 **대체 가능한 토큰(FT, Fungible Token)**

- Ex. 1 STK는 누구에게나 동일한 가치로 작용함
- 거래소 상장, 지갑 관리, DeFi 연동 등을 고려하면 ERC-20이 표준
- 해당 프로젝트는 DAO 확장성을 고려하고 있으며 DAO 툴 대부분이 ERC-20 기반임

### ERC-1155는 주로 NFT(뱃지처럼 고유한 개체)를 누적 발급할 때 유리

- STK는 '뱃지처럼 ID별 누적 추적'이 필요한 구조가 아니기 때문에 ERC-20이 적합

> 따라서 STK는 ERC-20으로 설계하고 배지는 ERC-1155로 설계하는 것이 가장 적합

---

## 디렉토리 구조

```bash
blockchain-toy-project/
├── blockchain/
│   ├── contracts/
│   │   ├── STKToken.sol          # STK 토큰
│   │   ├── BadgeNFT.sol          # 배지 NFT
│   │   └── Board.sol           # 게시판 기능 및 보상 관리 (사용자+관리자)
│   ├── migrations/
│   ├── test/
│   ├── build/
│   └── truffle-config.js
│
├── project-ui/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── client            # 사용자 화면
│   │   │   ├── manager           # 관리자 화면
│   │   ├── utils/
│   │   ├── abi/                  # Truffle 빌드된 ABI JSON 복사본
│   │   └── App.js
│   └── package.json
│
├── .env
├── README.md
└── project.md                    # 설계 문서

```
