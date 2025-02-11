package Blendeo.backend.search.service;

import Blendeo.backend.instrument.dto.InstrumentGetRes;
import Blendeo.backend.instrument.repository.InstrumentRepository;
import Blendeo.backend.instrument.repository.ProjectInstrumentRepository;
import Blendeo.backend.instrument.repository.UserInstrumentRepository;
import Blendeo.backend.project.dto.ProjectListDto;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.search.repository.SearchProjectRepository;
import Blendeo.backend.search.repository.SearchUserRepository;
import Blendeo.backend.user.dto.UserInfoGetRes;
import Blendeo.backend.user.entity.User;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchService {

    private final SearchProjectRepository searchProjectRepository;
    private final SearchUserRepository searchUserRepository;
    private final ProjectInstrumentRepository projectInstrumentRepository;
    private final UserInstrumentRepository uesrInstrumentRepository;

    public List<ProjectListDto> searchByProjectTitle(String title, int page, int size){
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Project> searchByProjectTitlePage = searchProjectRepository.findByTitleContaining(title, pageRequest);
        List<Project> projects = searchByProjectTitlePage.getContent();

        return projects.stream()
                .map(project -> ProjectListDto.builder()
                        .projectId(project.getId())
                        .title(project.getTitle())
                        .thumbnail(project.getThumbnail())
                        .viewCnt(project.getViewCnt())
                        .contributionCnt(project.getContributorCnt())
                        .duration(project.getRunningTime())
                        .authorId(project.getAuthor().getId())
                        .authorNickname(project.getAuthor().getNickname())
                        .authorProfileImage(project.getAuthor().getProfileImage())
                        .instruments(
                                projectInstrumentRepository.getAllByProjectId(project.getId()).stream()
                                        .map(projectInstrument ->
                                                projectInstrument.getInstrument() != null
                                                ? projectInstrument.getInstrument().getName()
                                                : projectInstrument.getEtcInstrument().getName()
                                        ).collect(Collectors.toList())
                        )
                        .createdAt(project.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public List<ProjectListDto> searchProjectByNickname(String nickname, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Project> searchProjectByUserNicknamePage = searchProjectRepository.findByAuthorNicknameContaining(nickname, pageRequest);
        List<Project> projects = searchProjectByUserNicknamePage.getContent();

        return projects.stream()
                .map(project -> ProjectListDto.builder()
                        .projectId(project.getId())
                        .title(project.getTitle())
                        .thumbnail(project.getThumbnail())
                        .viewCnt(project.getViewCnt())
                        .contributionCnt(project.getContributorCnt())
                        .duration(project.getRunningTime())
                        .authorId(project.getAuthor().getId())
                        .authorNickname(project.getAuthor().getNickname())
                        .authorProfileImage(project.getAuthor().getProfileImage())
                        .instruments(
                                projectInstrumentRepository.getAllByProjectId(project.getId()).stream()
                                        .map(projectInstrument ->
                                                projectInstrument.getInstrument() != null
                                                        ? projectInstrument.getInstrument().getName()
                                                        : projectInstrument.getEtcInstrument().getName()
                                        ).collect(Collectors.toList())
                        )
                        .createdAt(project.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public List<UserInfoGetRes> searchUserByNickname(String nickname, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<User> searchUserByNicknamePage = searchUserRepository.findByNicknameContaining(nickname, pageRequest);
        List<User> users = searchUserByNicknamePage.getContent();

        return users.stream()
                .map(user -> UserInfoGetRes.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .nickname(user.getNickname())
                        .profileImage(user.getProfileImage())
                        .header(user.getHeader())
                        .intro(user.getIntro())
                        .instruments(
                                uesrInstrumentRepository.getUserInstrumentsByUserId(user.getId())
                                        .orElseGet(Collections::emptyList)
                                        .stream()
                                        .map(userInstrument -> InstrumentGetRes.builder()
                                                .instrument_id(userInstrument.getInstrument().getId())
                                                .instrument_name(userInstrument.getInstrument().getName())
                                                .build()
                                        ).collect(Collectors.toList())
                        )
                        .build())
                .collect(Collectors.toList());
    }

    public List<UserInfoGetRes> searchUserByEmail(String email, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<User> searchUserByEmailPage = searchUserRepository.findByEmailContaining(email, pageRequest);
        List<User> users = searchUserByEmailPage.getContent();

        return users.stream()
                .map(user -> UserInfoGetRes.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .nickname(user.getNickname())
                        .profileImage(user.getProfileImage())
                        .header(user.getHeader())
                        .intro(user.getIntro())
                        .instruments(
                                uesrInstrumentRepository.getUserInstrumentsByUserId(user.getId())
                                        .orElseGet(Collections::emptyList)
                                        .stream()
                                        .map(userInstrument -> InstrumentGetRes.builder()
                                                .instrument_id(userInstrument.getInstrument().getId())
                                                .instrument_name(userInstrument.getInstrument().getName())
                                                .build()
                                        ).collect(Collectors.toList())
                        )
                        .build())
                .collect(Collectors.toList());
    }
}
