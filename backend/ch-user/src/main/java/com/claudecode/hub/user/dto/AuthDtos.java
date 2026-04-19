package com.claudecode.hub.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public final class AuthDtos {
    private AuthDtos() {}

    public record EmailRegisterReq(
            @NotBlank @Size(min = 3, max = 32) String username,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 64) String password,
            String nickname) {
    }

    public record EmailLoginReq(
            @NotBlank String account,
            @NotBlank String password) {
    }

    public record LoginResp(String token, long ttl, UserVO user) {
    }

    public record UserVO(
            long id,
            String username,
            String nickname,
            String avatar,
            String email,
            String bio,
            List<String> roles,
            ProfileVO profile) {
    }

    public record ProfileVO(
            int followersCount,
            int followingCount,
            int articleCount,
            int level,
            int points) {
    }
}
