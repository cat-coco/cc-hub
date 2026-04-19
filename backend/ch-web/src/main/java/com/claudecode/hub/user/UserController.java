package com.claudecode.hub.user;

import com.claudecode.hub.common.api.R;
import com.claudecode.hub.common.exception.BizException;
import com.claudecode.hub.user.dto.AuthDtos.UserVO;
import com.claudecode.hub.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public R<UserVO> detail(@PathVariable long id) {
        return R.ok(service.me(id));
    }
}
