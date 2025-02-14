package Blendeo.backend.chat.dto;

import Blendeo.backend.chat.entity.ChatRoom;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChatRoomCreateRes {
    long roomId;
    String roomName;
    List<Integer> userIds;

    @Builder
    public ChatRoomCreateRes(long roomId, String roomName, List<Integer> participants) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.userIds = participants;
    }
}
