package com.claudecode.hub.content.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.claudecode.hub.content.dto.ContentDtos.ToolVO;
import com.claudecode.hub.content.entity.Tool;
import com.claudecode.hub.content.mapper.ToolMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ToolService {
    private final ToolMapper mapper;

    public ToolService(ToolMapper mapper) {
        this.mapper = mapper;
    }

    public Map<String, List<ToolVO>> groupedByCategory() {
        return mapper.selectList(new LambdaQueryWrapper<Tool>().orderByAsc(Tool::getSortOrder))
                .stream()
                .map(this::toVO)
                .collect(Collectors.groupingBy(ToolVO::category));
    }

    public List<ToolVO> list(String category) {
        LambdaQueryWrapper<Tool> qw = new LambdaQueryWrapper<Tool>().orderByAsc(Tool::getSortOrder);
        if (category != null && !category.isBlank()) qw.eq(Tool::getCategory, category);
        return mapper.selectList(qw).stream().map(this::toVO).toList();
    }

    private ToolVO toVO(Tool t) {
        List<String> tags = t.getTags() == null || t.getTags().isBlank()
                ? List.of()
                : List.of(t.getTags().split(","));
        return new ToolVO(t.getId(), t.getName(), t.getDescription(), t.getIcon(), t.getUrl(),
                t.getCategory(), tags, t.getVersion(), t.getLicense(), t.getStars());
    }
}
