package com.claudecode.hub.user.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.claudecode.hub.common.exception.BizException;
import com.claudecode.hub.security.JwtService;
import com.claudecode.hub.user.dto.AuthDtos;
import com.claudecode.hub.user.entity.User;
import com.claudecode.hub.user.entity.UserProfile;
import com.claudecode.hub.user.mapper.UserMapper;
import com.claudecode.hub.user.mapper.UserProfileMapper;
import com.claudecode.hub.user.mapper.UserRoleMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserMapper userMapper;
    private final UserProfileMapper profileMapper;
    private final UserRoleMapper roleMapper;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public UserService(UserMapper userMapper, UserProfileMapper profileMapper,
                       UserRoleMapper roleMapper, PasswordEncoder encoder, JwtService jwt) {
        this.userMapper = userMapper;
        this.profileMapper = profileMapper;
        this.roleMapper = roleMapper;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @Transactional
    public AuthDtos.LoginResp registerWithEmail(AuthDtos.EmailRegisterReq req) {
        if (userMapper.selectCount(new LambdaQueryWrapper<User>().eq(User::getUsername, req.username())) > 0) {
            throw new BizException("用户名已被使用");
        }
        if (userMapper.selectCount(new LambdaQueryWrapper<User>().eq(User::getEmail, req.email())) > 0) {
            throw new BizException("邮箱已被使用");
        }
        User u = new User();
        u.setUsername(req.username());
        u.setEmail(req.email());
        u.setNickname(req.nickname() != null && !req.nickname().isBlank() ? req.nickname() : req.username());
        u.setPasswordHash(encoder.encode(req.password()));
        u.setStatus(0);
        userMapper.insert(u);

        UserProfile p = new UserProfile();
        p.setUserId(u.getId());
        p.setFollowersCount(0);
        p.setFollowingCount(0);
        p.setArticleCount(0);
        p.setLevel(1);
        p.setPoints(0);
        profileMapper.insert(p);

        roleMapper.assignRole(u.getId(), "ROLE_USER");
        List<String> roles = roleMapper.findRoleCodesByUserId(u.getId());

        String token = jwt.issue(u.getId(), u.getUsername(), roles);
        return new AuthDtos.LoginResp(token, jwt.ttl(), toVO(u, p, roles));
    }

    public AuthDtos.LoginResp loginWithEmail(AuthDtos.EmailLoginReq req) {
        User u = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getEmail, req.account())
                .or()
                .eq(User::getUsername, req.account()));
        if (u == null || !encoder.matches(req.password(), u.getPasswordHash())) {
            throw new BizException(401, "账号或密码错误");
        }
        if (u.getStatus() != null && u.getStatus() != 0) {
            throw new BizException(403, "账号已被禁用");
        }
        UserProfile p = profileMapper.selectById(u.getId());
        List<String> roles = roleMapper.findRoleCodesByUserId(u.getId());
        String token = jwt.issue(u.getId(), u.getUsername(), roles);
        return new AuthDtos.LoginResp(token, jwt.ttl(), toVO(u, p, roles));
    }

    public AuthDtos.UserVO me(long userId) {
        User u = userMapper.selectById(userId);
        if (u == null) throw new BizException(404, "用户不存在");
        UserProfile p = profileMapper.selectById(userId);
        List<String> roles = roleMapper.findRoleCodesByUserId(userId);
        return toVO(u, p, roles);
    }

    private AuthDtos.UserVO toVO(User u, UserProfile p, List<String> roles) {
        AuthDtos.ProfileVO pv = p == null
                ? new AuthDtos.ProfileVO(0, 0, 0, 1, 0)
                : new AuthDtos.ProfileVO(
                        n(p.getFollowersCount()),
                        n(p.getFollowingCount()),
                        n(p.getArticleCount()),
                        n(p.getLevel(), 1),
                        n(p.getPoints()));
        return new AuthDtos.UserVO(
                u.getId(), u.getUsername(), u.getNickname(), u.getAvatar(),
                u.getEmail(), u.getBio(), roles, pv);
    }

    private int n(Integer v) {
        return v == null ? 0 : v;
    }

    private int n(Integer v, int fallback) {
        return v == null ? fallback : v;
    }
}
