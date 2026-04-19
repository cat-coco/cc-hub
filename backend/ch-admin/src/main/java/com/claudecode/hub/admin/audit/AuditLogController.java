package com.claudecode.hub.admin.audit;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.claudecode.hub.admin.audit.mapper.AuditLogMapper;
import com.claudecode.hub.common.api.PageResult;
import com.claudecode.hub.common.api.R;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/audit-logs")
@Tag(name = "Admin · Audit")
public class AuditLogController {

    private final AuditLogMapper mapper;

    public AuditLogController(AuditLogMapper mapper) {
        this.mapper = mapper;
    }

    @GetMapping
    public R<PageResult<AuditLog>> list(
            @RequestParam(required = false) String logType,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String resourceType,
            @RequestParam(required = false) Long resourceId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") long page,
            @RequestParam(defaultValue = "20") long size) {
        LambdaQueryWrapper<AuditLog> qw = new LambdaQueryWrapper<>();
        if (logType != null)      qw.eq(AuditLog::getLogType, logType);
        if (userId != null)       qw.eq(AuditLog::getUserId, userId);
        if (resourceType != null) qw.eq(AuditLog::getResourceType, resourceType);
        if (resourceId != null)   qw.eq(AuditLog::getResourceId, resourceId);
        if (startDate != null)    qw.ge(AuditLog::getCreatedAt, LocalDateTime.parse(startDate + "T00:00:00"));
        if (endDate != null)      qw.le(AuditLog::getCreatedAt, LocalDateTime.parse(endDate + "T23:59:59"));
        qw.orderByDesc(AuditLog::getCreatedAt);
        Page<AuditLog> paged = mapper.selectPage(new Page<>(page, size), qw);
        return R.ok(PageResult.of(paged));
    }
}
