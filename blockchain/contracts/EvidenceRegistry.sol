// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract EvidenceRegistry {
    struct EvidenceRecord {
        bytes32 evidenceHash;
        string caseId;
        string evidenceId;
        uint256 timestamp;
        string registeredBy;
        bool exists;
    }

    mapping(bytes32 => EvidenceRecord) private records;

    event EvidenceRegistered(
        bytes32 indexed evidenceHash,
        string indexed caseId,
        string evidenceId,
        uint256 timestamp,
        string registeredBy
    );

    function registerEvidence(
        bytes32 evidenceHash,
        string calldata caseId,
        string calldata evidenceId,
        string calldata registeredBy
    ) external {
        require(!records[evidenceHash].exists, "Evidence hash already registered");
        records[evidenceHash] = EvidenceRecord(evidenceHash, caseId, evidenceId, block.timestamp, registeredBy, true);
        emit EvidenceRegistered(evidenceHash, caseId, evidenceId, block.timestamp, registeredBy);
    }

    function getEvidence(bytes32 evidenceHash) external view returns (EvidenceRecord memory) {
        require(records[evidenceHash].exists, "Evidence not registered");
        return records[evidenceHash];
    }

    function isEvidenceRegistered(bytes32 evidenceHash) external view returns (bool) {
        return records[evidenceHash].exists;
    }
}

