package com.claudecode.hub.admin.report;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.claudecode.hub.admin.report.mapper.ReportMapper;
import com.claudecode.hub.common.api.PageResult;
import com.claudecode.hub.common.api.R;
import com.claudecode.hub.common.exception.BizException;
import com.claudecode.hub.security.CurrentUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/reports")
@Tag(name = "Admin · Reports", description = "举报处理")
public class ReportController {

    private static final Set<String> VALID_DECISIONS = Set.of("APPROVED", "REJECTED");

    private final ReportMapper mapper;

    public ReportController(ReportMapper mapper) {
        this.mapper = mapper;
    }

    public record HandleReq(@NotBlank String decision, String remark) {}

    @GetMapping
    @Operation(summary = "列表")
    public R<PageResult<Report>> list(@RequestParam(required = false) String status,
                                      @RequestParam(required = false) String targetType,
                                      @RequestParam(defaultValue = "1") long page,
                                      @RequestParam(defaultValue = "20") long size) {
        LambdaQueryWrapper<Report> qw = new LambdaQueryWrapper<>();
        if (status != null && !status.isBlank()) qw.eq(Report::getStatus, status);
        if (targetType != null && !targetType.isBlank()) qw.eq(Report::getTargetType, targetType);
        qw.orderByDesc(Report::getCreatedAt);
        Page<Report> paged = mapper.selectPage(new Page<>(page, size), qw);
        return R.ok(PageResult.of(paged));
    }

    @GetMapping("/{id}")
    public R<Report> detail(@PathVariable long id) {
        Report r = mapper.selectById(id);
        if (r == null) throw new BizException(404, "举报不存在");
        return R.ok(r);
    }

    @PostMapping("/{id}/handle")
    @Operation(summary = "处理（decision = APPROVED/REJECTED）")
    public R<Report> handle(@PathVariable long id, @Valid @RequestBody HandleReq req) {
        Report rep = mapper.selectById(id);
        if (rep == null) throw new BizException(404, "举报不存在");
        if (!VALID_DECISIONS.contains(req.decision())) throw new BizException("无效的处理结果");
        rep.setStatus(req.decision());
        rep.setHandlerId(CurrentUser.requireId());
        rep.setHandleRemark(req.remark());
        rep.setHandledAt(LocalDateTime.now());
        mapper.updateById(rep);
        return R.ok(rep);
    }
}
