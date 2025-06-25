package Blendeo.backend.chat.dto;

import lombok.Getter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class ChatRoomPariticipantRes {
    long chatRoomId;
    List<Integer> userIds;

    public ChatRoomPariticipantRes(long chatRoomId, List<Integer> userIds) {
        this.chatRoomId = chatRoomId;
        this.userIds = userIds;
    }
}
