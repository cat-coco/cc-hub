package com.claudecode.hub.admin.sensitive;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.claudecode.hub.admin.sensitive.mapper.SensitiveWordMapper;
import com.claudecode.hub.common.api.R;
import com.claudecode.hub.common.exception.BizException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/sensitive-words")
@Tag(name = "Admin · Sensitive Words")
public class SensitiveWordController {

    private final SensitiveWordMapper mapper;

    public SensitiveWordController(SensitiveWordMapper mapper) {
        this.mapper = mapper;
    }

    public record UpsertReq(
            @NotBlank @Size(max = 100) String word,
            @Min(1) @Max(3) int level,
            String category,
            Boolean enabled) {}

    @GetMapping
    public R<List<SensitiveWord>> list(@RequestParam(required = false) String category,
                                        @RequestParam(required = false) Integer level) {
        LambdaQueryWrapper<SensitiveWord> qw = new LambdaQueryWrapper<>();
        if (category != null) qw.eq(SensitiveWord::getCategory, category);
        if (level != null) qw.eq(SensitiveWord::getLevel, level);
        qw.orderByDesc(SensitiveWord::getCreatedAt);
        return R.ok(mapper.selectList(qw));
    }

    @PostMapping
    public R<SensitiveWord> create(@Valid @RequestBody UpsertReq req) {
        if (mapper.selectCount(new LambdaQueryWrapper<SensitiveWord>().eq(SensitiveWord::getWord, req.word())) > 0) {
            throw new BizException("该敏感词已存在");
        }
        SensitiveWord w = new SensitiveWord();
        w.setWord(req.word());
        w.setLevel(req.level());
        w.setCategory(req.category());
        w.setEnabled(req.enabled() == null || req.enabled());
        mapper.insert(w);
        return R.ok(w);
    }

    @PutMapping("/{id}")
    public R<SensitiveWord> update(@PathVariable long id, @Valid @RequestBody UpsertReq req) {
        SensitiveWord w = mapper.selectById(id);
        if (w == null) throw new BizException(404, "敏感词不存在");
        w.setWord(req.word());
        w.setLevel(req.level());
        w.setCategory(req.category());
        w.setEnabled(req.enabled() == null || req.enabled());
        mapper.updateById(w);
        return R.ok(w);
    }

    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable long id) {
        mapper.deleteById(id);
        return R.ok();
    }

    @PostMapping("/import")
    @Operation(summary = "批量导入（每行一个词：word,level[,category]）")
    public R<Integer> importWords(@RequestBody String body) {
        if (body == null || body.isBlank()) return R.ok(0);
        int n = 0;
        for (String line : body.split("\n")) {
            String[] parts = line.trim().split(",");
            if (parts.length < 2 || parts[0].isBlank()) continue;
            int level;
            try { level = Math.max(1, Math.min(3, Integer.parseInt(parts[1].trim()))); }
            catch (NumberFormatException e) { continue; }
            String word = parts[0].trim();
            if (mapper.selectCount(new LambdaQueryWrapper<SensitiveWord>().eq(SensitiveWord::getWord, word)) > 0) continue;
            SensitiveWord w = new SensitiveWord();
            w.setWord(word);
            w.setLevel(level);
            if (parts.length >= 3) w.setCategory(parts[2].trim());
            w.setEnabled(true);
            mapper.insert(w);
            n++;
        }
        return R.ok(n);
    }
}
