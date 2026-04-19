package com.claudecode.hub.notification;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.claudecode.hub.common.api.PageResult;
import com.claudecode.hub.common.api.R;
import com.claudecode.hub.notification.mapper.NotificationMapper;
import com.claudecode.hub.security.CurrentUser;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications")
public class NotificationController {
    private final NotificationMapper mapper;

    public NotificationController(NotificationMapper mapper) {
        this.mapper = mapper;
    }

    @GetMapping
    public R<PageResult<Notification>> list(@RequestParam(defaultValue = "1") long page,
                                            @RequestParam(defaultValue = "20") long size) {
        long uid = CurrentUser.requireId();
        Page<Notification> paged = mapper.selectPage(new Page<>(page, size),
                new LambdaQueryWrapper<Notification>()
                        .eq(Notification::getUserId, uid)
                        .orderByDesc(Notification::getCreatedAt));
        return R.ok(PageResult.of(paged));
    }

    @GetMapping("/unread-count")
    public R<Long> unreadCount() {
        long uid = CurrentUser.requireId();
        return R.ok(mapper.selectCount(new LambdaQueryWrapper<Notification>()
                .eq(Notification::getUserId, uid)
                .eq(Notification::getIsRead, false)));
    }

    @PostMapping("/{id}/read")
    public R<Void> read(@PathVariable long id) {
        long uid = CurrentUser.requireId();
        Notification n = mapper.selectById(id);
        if (n == null || !n.getUserId().equals(uid)) return R.ok();
        n.setIsRead(true);
        mapper.updateById(n);
        return R.ok();
    }
}
