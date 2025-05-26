// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// postMessage(string title, string content), 글 작성 (msg.value == 0.5 ETH)

// getAllPosts(), 전체 글 목록 확인

// getUserInfo(address user), 사용자의 등급, 글 수, 보상, 배지 등 확인

// isMember(address user), 멤버 여부 조회

// registerMember(address user), 관리자 전용 멤버 등록 기능

// calculateLevel(address user), 등급 자동 판단 로직

// rewardUser(address user), 등급에 따라 STK 지급

// issueBadge(address user), 등급 만족 시 배지 발급 (BadgeNFT 호출)
