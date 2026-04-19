package com.claudecode.hub.qa.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.claudecode.hub.common.api.PageResult;
import com.claudecode.hub.common.api.R;
import com.claudecode.hub.qa.entity.Answer;
import com.claudecode.hub.qa.entity.Question;
import com.claudecode.hub.qa.mapper.AnswerMapper;
import com.claudecode.hub.qa.mapper.QuestionMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@Tag(name = "QA", description = "问答")
public class QuestionController {
    private final QuestionMapper questionMapper;
    private final AnswerMapper answerMapper;

    public QuestionController(QuestionMapper questionMapper, AnswerMapper answerMapper) {
        this.questionMapper = questionMapper;
        this.answerMapper = answerMapper;
    }

    @GetMapping
    public R<PageResult<Question>> list(@RequestParam(defaultValue = "1") long page,
                                        @RequestParam(defaultValue = "10") long size) {
        Page<Question> paged = questionMapper.selectPage(new Page<>(page, size),
                new LambdaQueryWrapper<Question>().orderByDesc(Question::getCreatedAt));
        return R.ok(PageResult.of(paged));
    }

    @GetMapping("/{id}")
    public R<Question> detail(@PathVariable long id) {
        return R.ok(questionMapper.selectById(id));
    }

    @GetMapping("/{id}/answers")
    public R<List<Answer>> answers(@PathVariable long id) {
        return R.ok(answerMapper.selectList(new LambdaQueryWrapper<Answer>()
                .eq(Answer::getQuestionId, id)
                .orderByDesc(Answer::getIsAccepted, Answer::getVoteUp)));
    }
}
