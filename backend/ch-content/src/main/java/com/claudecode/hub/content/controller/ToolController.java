package com.claudecode.hub.content.controller;

import com.claudecode.hub.common.api.R;
import com.claudecode.hub.content.dto.ContentDtos.ToolVO;
import com.claudecode.hub.content.service.ToolService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tools")
@Tag(name = "Tools")
public class ToolController {
    private final ToolService service;

    public ToolController(ToolService service) {
        this.service = service;
    }

    @GetMapping
    public R<List<ToolVO>> list(@RequestParam(required = false) String category) {
        return R.ok(service.list(category));
    }

    @GetMapping("/grouped")
    public R<Map<String, List<ToolVO>>> grouped() {
        return R.ok(service.groupedByCategory());
    }
}
