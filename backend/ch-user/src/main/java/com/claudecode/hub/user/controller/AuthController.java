package com.claudecode.hub.user.controller;

import com.claudecode.hub.common.api.R;
import com.claudecode.hub.common.exception.BizException;
import com.claudecode.hub.security.AuthPrincipal;
import com.claudecode.hub.security.CurrentUser;
import com.claudecode.hub.user.dto.AuthDtos;
import com.claudecode.hub.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "认证登录")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register/email")
    @Operation(summary = "邮箱注册")
    public R<AuthDtos.LoginResp> registerEmail(@Valid @RequestBody AuthDtos.EmailRegisterReq req) {
        return R.ok(userService.registerWithEmail(req));
    }

    @PostMapping("/login/email")
    @Operation(summary = "邮箱/用户名登录")
    public R<AuthDtos.LoginResp> loginEmail(@Valid @RequestBody AuthDtos.EmailLoginReq req) {
        return R.ok(userService.loginWithEmail(req));
    }

    @GetMapping("/me")
    @Operation(summary = "当前登录用户信息")
    public R<AuthDtos.UserVO> me() {
        AuthPrincipal p = CurrentUser.get();
        if (p == null) throw new BizException(401, "未登录");
        return R.ok(userService.me(p.userId()));
    }

    @PostMapping("/logout")
    @Operation(summary = "退出登录（前端清除 token 即可）")
    public R<Void> logout() {
        return R.ok();
    }
}
