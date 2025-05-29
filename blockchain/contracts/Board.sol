// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./BadgeNFT.sol";
import "./STKToken.sol";

contract Board is Ownable {
    STKToken public stkToken;
    BadgeNFT public badgeNFT;

    enum Grade {
        NOMAL,
        GOOD,
        BEST,
        MVP
    }

    struct Post {
        uint postId; // 글 목록을 순서대로 정렬하기 위함, mapping은 키 기반임
        address user; // 작성자
        string content; // 작성 글
        uint timestamp; // 작성 시간
    }

    uint private postCount;
    mapping(uint => Post) public posts;
    /*
        posts = {
            0 : {
                postId : 1,
                user : "작성자 EOAs",
                content : "글 작성 내용",
                timestamp : ""
            }
        }
     */

    mapping(address => uint256) public userPostCount;
    mapping(address => uint256) public userReward; // 사용자 보상
    uint private memberCount;
    mapping(address => bool) private members; // 멤버 여부

    constructor(
        address _stkToken,
        address _badgeNFT,
        address initialOwner
    ) Ownable(initialOwner) {
        stkToken = STKToken(_stkToken); // STKToken CA
        badgeNFT = BadgeNFT(_badgeNFT); // BadgeNFT CA
        members[initialOwner] = true;
    }

    // [관리자] STKToken 민팅
    function mintSTK() public onlyOwner {
        stkToken.mintSTK(); // Board가 STKToken의 owner니까 호출 가능
    }

    // [관리자] 멤버 등록 기능
    function setMember(address _address) public onlyOwner {
        require(!members[_address], "Already a member"); // 멤버 여부 확인

        members[_address] = true;
        memberCount += 1;

        _issuBadge(_address); // 멤버 인정 시점에서 등급 조건 만족했을 때 배지 발급
    }

    // [사용자] 글 작성 (msg.value == 0.5 ETH)
    function postMessage(string memory _content) public payable {
        // 글 작성 시 0.5 ETH 보내야 함
        require(msg.value == 0.5 ether, "Must send 0.5 ETH");

        posts[postCount] = Post({
            postId: postCount,
            user: msg.sender,
            content: _content,
            timestamp: block.timestamp
        });

        userPostCount[msg.sender]++;
        postCount++;

        _rewardSTK(msg.sender); // STK 보상 지급
        _issuBadge(msg.sender); // 배지 발급
    }

    // 등급 자동 판단 로직
    function _adjustGrade(
        address user
    ) internal view returns (Grade grade, uint256 badgeId) {
        if (!members[user]) {
            return (Grade.NOMAL, 999); // 멤버가 아니면 무조건 일반회원
        }

        uint256 post = userPostCount[user];
        uint256 reward = userReward[user];

        if (post >= 20 && reward >= 100) return (Grade.MVP, 2); // MVP
        if (post >= 10 && reward >= 10) return (Grade.BEST, 1); // BEST
        if (post >= 3 && reward >= 3) return (Grade.GOOD, 0); // GOOD
        return (Grade.NOMAL, 999); // 일반 회원 (배지 없음)
    }

    // 등급에 따라 STK 보상 지급
    function _rewardSTK(address user) internal {
        (Grade grade, ) = _adjustGrade(user); // (grade, badgeId) 두 개 넘겨줘야 하지만 badgeId 무시하고 grade만 받음
        uint256 rewardAmount = 0; // 보상으로 줄 STK Token

        // _adjustGrade에서 등급 판별 후 STKToken 호출해서 해당 등급에 맞는 STK 보상 발급
        if (grade == Grade.MVP && members[user] == true) {
            rewardAmount = 20;
        } else if (grade == Grade.GOOD && members[user] == true) {
            rewardAmount = 10;
        } else if (grade == Grade.BEST && members[user] == true) {
            rewardAmount = 2;
        } else rewardAmount = 1;

        // STK 잔고 부족
        require(
            stkToken.balanceOf(address(this)) >= rewardAmount,
            "Insufficient STK balance"
        );

        stkToken.transfer(user, rewardAmount); // 사용자한테 등급만큼 STK 보상 지급
        userReward[user] += rewardAmount;
    }

    // 등급 만족 시 배지 발급 (BadgeNFT 호출)
    function _issuBadge(address user) internal {
        if (!members[user]) return; // 멤버만 발급 가능함

        // _adjustGrade에서 등급 판별 후 BadgeNFT 호출해서 해당 등급에 맞는 배지 발급
        (, uint256 badgeId) = _adjustGrade(user); // (grade, badgeId) 두 개 넘겨줘야 하지만 grade 무시하고 badgeId만 받음
        if (badgeId == 999) return; // 일반 회원 (배지 없음)

        badgeNFT.mintBadge(user, badgeId, 1); // 배지 발급 (ERC1155)
    }

    // 특정 사용자의 EOA, 멤버 여부, 글 수, 누적 보상, 등급, 배지,
    function getUserInfo(
        address user
    )
        public
        view
        returns (
            address userAddress,
            bool isMember,
            uint256 numPosts,
            uint256 totalReward,
            Grade grade,
            uint256[3] memory badgeBalances
        )
    {
        (Grade userGrade, ) = _adjustGrade(user);

        badgeBalances[0] = badgeNFT.balanceOf(user, 0); // GOOD
        badgeBalances[1] = badgeNFT.balanceOf(user, 1); // BEST
        badgeBalances[2] = badgeNFT.balanceOf(user, 2); // MVP

        return (
            user, // 사용자 주소
            members[user], // 멤버 등록 여부
            userPostCount[user], // 누적 작성 글 수
            userReward[user], // STK 보상
            userGrade, // 현재 등급
            badgeBalances // 배지 수량 배열 [GOOD,]
        );
    }

    // getAllPosts(), 전체 글 목록 확인
    function getAllPosts(
        uint postId
    )
        public
        view
        returns (string memory content, address user, uint256 timestamp)
    {
        require(postId < postCount, "Invalid post ID");

        Post storage p = posts[postId];
        return (p.content, p.user, p.timestamp);
    }

    function getPostCount() public view returns (uint256) {
        return postCount;
    }
}
