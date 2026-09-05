"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";

interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  dueDate: string;
  subtasks: SubTask[];
  completed: boolean;
  createdAt: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  actionEn: string;
  actionJa: string;
}

interface TodoListDashboardProps {
  locale: string;
}

const priorityWeight = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

export default function TodoListDashboard({ locale }: TodoListDashboardProps) {
  const isJa = locale === "ja";
  
  // --- UI Translations ---
  const t = {
    title: isJa ? "インタラクティブ・やることリスト" : "Interactive To-Do List",
    subtitle: isJa 
      ? "カテゴリ分類、優先度設定、進捗チェックリスト、ポモドーロ集中タイマー、統計レポートを備えたパーソナルダッシュボード。" 
      : "A personal productivity suite featuring category tagging, priority tiers, checklists, focus timers, and dashboard analytics.",
    tabTasks: isJa ? "マイタスク" : "My Tasks",
    tabAnalytics: isJa ? "分析・レポート" : "Analytics & Logs",
    addTask: isJa ? "新しいタスク" : "New Task",
    editTask: isJa ? "タスクを編集" : "Edit Task",
    save: isJa ? "保存" : "Save",
    cancel: isJa ? "キャンセル" : "Cancel",
    searchPlaceholder: isJa ? "タスクを検索..." : "Search tasks...",
    filterStatus: isJa ? "ステータス" : "Status",
    filterPriority: isJa ? "優先度" : "Priority",
    filterCategory: isJa ? "カテゴリ" : "Category",
    sortBy: isJa ? "並び替え" : "Sort By",
    sortDueDate: isJa ? "期限順" : "Due Date",
    sortPriority: isJa ? "優先度順" : "Priority Level",
    sortCreated: isJa ? "作成日順" : "Date Created",
    noTasks: isJa ? "タスクが見つかりません" : "No tasks found",
    createOne: isJa ? "最初のタスクを作成しましょう" : "Create a task to get started",
    taskTitle: isJa ? "タイトル" : "Title",
    taskTitlePlaceholder: isJa ? "例：AIアーキテクチャの設計" : "e.g., Design AI architecture",
    taskDesc: isJa ? "説明" : "Description",
    taskDescPlaceholder: isJa ? "タスクの詳細を入力..." : "Describe the details...",
    taskPriority: isJa ? "優先度" : "Priority",
    taskCategory: isJa ? "カテゴリ" : "Category",
    customCategory: isJa ? "カスタムカテゴリ" : "Or custom category...",
    dueDateLabel: isJa ? "期限" : "Due Date",
    subtasksLabel: isJa ? "サブタスク" : "Subtasks",
    addSubtaskBtn: isJa ? "サブタスクを追加" : "Add Subtask",
    subtaskPlaceholder: isJa ? "新しいサブタスク項目を入力..." : "New subtask item...",
    focusMode: isJa ? "フォーカスモード" : "Focus Mode",
    focusTimer: isJa ? "集中タイマー" : "Pomodoro Focus Timer",
    focusStart: isJa ? "タイマーを開始" : "Start Focus",
    focusPause: isJa ? "一時停止" : "Pause Timer",
    focusResume: isJa ? "タイマーを再開" : "Resume Focus",
    focusReset: isJa ? "リセット" : "Reset",
    focusCompleted: isJa ? "おめでとうございます！集中セッションが完了しました。" : "Congratulations! Focus session completed.",
    activeFocusTask: isJa ? "現在のフォーカスタスク" : "Active Focus Task",
    selectFocusTask: isJa ? "タスクを選択してフォーカスを開始" : "Select a task above to focus",
    statsTitle: isJa ? "進捗サマリー" : "Progress Summary",
    statsCompleted: isJa ? "完了率" : "Completion Rate",
    statsActive: isJa ? "進行中のタスク" : "Active Tasks",
    statsOverdue: isJa ? "期限切れのタスク" : "Overdue Tasks",
    statsFocusSessions: isJa ? "完了した集中セッション" : "Focus Sessions Done",
    categoryDistribution: isJa ? "カテゴリ別タスク数" : "Tasks by Category",
    recentActivity: isJa ? "最近のアクティビティ" : "Recent Activity",
    activeLabel: isJa ? "進行中" : "Active",
    completedLabel: isJa ? "完了" : "Completed",
    allLabel: isJa ? "すべて" : "All",
    critical: isJa ? "クリティカル" : "Critical",
    high: isJa ? "高" : "High",
    medium: isJa ? "中" : "Medium",
    low: isJa ? "低" : "Low",
    overdueAlert: isJa ? "期限切れ！" : "Overdue!",
    dueTodayAlert: isJa ? "今日が期限！" : "Due today!",
    dueTomorrowAlert: isJa ? "明日が期限" : "Due tomorrow",
    dueDaysAlert: (days: number) => isJa ? `期限まであと ${days} 日` : `Due in ${days} days`,
    deleteConfirm: isJa ? "このタスクを削除してもよろしいですか？" : "Are you sure you want to delete this task?",
  };

  // --- State Variables ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<"tasks" | "analytics">("tasks");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // --- Filter and Search State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "createdAt">("dueDate");

  // --- Form State ---
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<"critical" | "high" | "medium" | "low">("medium");
  const [formCategory, setFormCategory] = useState("Work");
  const [formCustomCategory, setFormCustomCategory] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formSubtasks, setFormSubtasks] = useState<string[]>([]);
  const [newSubtaskText, setNewSubtaskText] = useState("");

  // --- Focus Timer State ---
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null);
  const [timerDuration, setTimerDuration] = useState(25); // in minutes
  const [timeRemaining, setTimeRemaining] = useState(1500); // 25 * 60 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const handleTimerCompletionRef = useRef<() => void>(() => {});

  // --- Hydration & Persistence Loader ---
  useEffect(() => {
    // --- Initial Seed Data ---
    const getSeedTasks = (): Task[] => [
      {
        id: "task-1",
        title: isJa ? "AI変革フレームワークの提案資料作成" : "Prepare AI Transformation Presentation",
        description: isJa 
          ? "スタンフォードの講義内容とインサイトモデルを統合した役員向けプレゼンテーション。" 
          : "Integrate insights from Stanford seminars and current frameworks for executive deck.",
        priority: "critical",
        category: isJa ? "仕事" : "Work",
        dueDate: new Date().toISOString().split("T")[0], // Today
        completed: false,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        subtasks: [
          { id: "sub-1-1", text: isJa ? "スライドのアウトライン構成" : "Outline the slides", completed: true },
          { id: "sub-1-2", text: isJa ? "ROIシミュレーターのデータ埋め込み" : "Embed ROI simulation charts", completed: false },
          { id: "sub-1-3", text: isJa ? "ガバナンス規則セクションの確認" : "Verify governance audit checklist", completed: false }
        ]
      },
      {
        id: "task-2",
        title: isJa ? "ウェアラブル心拍数APIシンクロナイザーの実装" : "Implement Wearable API Sync",
        description: isJa 
          ? "HealthKitの心拍数および睡眠データを処理するモックサーバーエンドポイントの作成。" 
          : "Create mock backend sync handlers for wearable analytics pipeline.",
        priority: "high",
        category: isJa ? "健康" : "Health",
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // In 2 days
        completed: false,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        subtasks: [
          { id: "sub-2-1", text: isJa ? "データスキーマのバリデーション定義" : "Define TypeScript zod interface schema", completed: true },
          { id: "sub-2-2", text: isJa ? "モックポーリング関数のデバッグ" : "Debug rate limits on mock fetch loops", completed: true },
          { id: "sub-2-3", text: isJa ? "同期遅延アラートのテスト" : "Unit test sync lag warnings", completed: false }
        ]
      },
      {
        id: "task-3",
        title: isJa ? "インサイト一覧ページのSEO最適化監査" : "SEO Audit for Insights Catalog",
        description: isJa 
          ? "メタディスクリプションの文字数と翻訳キーの整合性チェック。" 
          : "Audit description character lengths and translation files for SEO scanner.",
        priority: "medium",
        category: isJa ? "開発" : "Dev",
        dueDate: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Overdue (Yesterday)
        completed: true,
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        subtasks: [
          { id: "sub-3-1", text: isJa ? "メタデータ文字数の自動チェック" : "Write auto-checks for meta lengths", completed: true },
          { id: "sub-3-2", text: isJa ? "全翻訳ファイルのバリデーション" : "Verify all translation files", completed: true }
        ]
      }
    ];

    const getSeedLogs = (): ActivityLog[] => [
      {
        id: "log-1",
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        actionEn: "Created 'Prepare AI Transformation Presentation'",
        actionJa: "タスク『AI変革フレームワークの提案資料作成』を作成しました"
      },
      {
        id: "log-2",
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
        actionEn: "Completed subtask 'Define TypeScript zod interface schema'",
        actionJa: "サブタスク『データスキーマのバリデーション定義』を完了しました"
      }
    ];

    setIsClient(true);
    const savedTasks = localStorage.getItem("kakehashi_todo_tasks");
    const savedLogs = localStorage.getItem("kakehashi_todo_logs");
    const savedSessions = localStorage.getItem("kakehashi_todo_sessions");

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch {
        setTasks(getSeedTasks());
      }
    } else {
      setTasks(getSeedTasks());
    }

    if (savedLogs) {
      try {
        setActivityLog(JSON.parse(savedLogs));
      } catch {
        setActivityLog(getSeedLogs());
      }
    } else {
      setActivityLog(getSeedLogs());
    }

    if (savedSessions) {
      setCompletedSessions(Number(savedSessions) || 0);
    }
  }, [isJa]);

  // --- Persist States ---
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("kakehashi_todo_tasks", JSON.stringify(tasks));
    }
  }, [tasks, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("kakehashi_todo_logs", JSON.stringify(activityLog));
    }
  }, [activityLog, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("kakehashi_todo_sessions", String(completedSessions));
    }
  }, [completedSessions, isClient]);

  // --- Timer Interval Effect ---
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            handleTimerCompletionRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, handleTimerCompletionRef]);

  // Reset time remaining when timer duration changes (and is not running)
  useEffect(() => {
    if (!isTimerRunning) {
      setTimeRemaining(timerDuration * 60);
    }
  }, [timerDuration, isTimerRunning]);

  // --- Activity Log Logger ---
  const addLogEntry = (en: string, ja: string) => {
    const newEntry: ActivityLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      actionEn: en,
      actionJa: ja
    };
    setActivityLog((prev) => [newEntry, ...prev].slice(0, 50)); // Limit to last 50 logs
  };

  // --- Form Handlers ---
  const handleOpenAddForm = () => {
    setEditingTask(null);
    setFormTitle("");
    setFormDesc("");
    setFormPriority("medium");
    setFormCategory(isJa ? "仕事" : "Work");
    setFormCustomCategory("");
    setFormDueDate(new Date(Date.now() + 86400000).toISOString().split("T")[0]); // Default Tomorrow
    setFormSubtasks([]);
    setNewSubtaskText("");
    setShowAddForm(true);
  };

  const handleOpenEditForm = (task: Task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDesc(task.description);
    setFormPriority(task.priority);
    setFormCategory(task.category);
    setFormCustomCategory("");
    setFormDueDate(task.dueDate);
    setFormSubtasks(task.subtasks.map((st) => st.text));
    setNewSubtaskText("");
    setShowAddForm(true);
  };

  const handleAddSubtaskInput = () => {
    if (newSubtaskText.trim()) {
      setFormSubtasks([...formSubtasks, newSubtaskText.trim()]);
      setNewSubtaskText("");
    }
  };

  const handleRemoveFormSubtask = (index: number) => {
    setFormSubtasks(formSubtasks.filter((_, i) => i !== index));
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const finalCategory = formCustomCategory.trim() || formCategory;

    if (editingTask) {
      // Edit mode
      const updatedSubtasks: SubTask[] = formSubtasks.map((text) => {
        // Keep completed status if it existed in the editing task
        const existing = editingTask.subtasks.find((st) => st.text === text);
        return {
          id: existing?.id || `sub-${Date.now()}-${Math.random()}`,
          text,
          completed: existing?.completed || false
        };
      });

      // Recalculate completion of overall task if it had subtasks and they were all completed
      const allCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every((s) => s.completed);

      setTasks(
        tasks.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: formTitle.trim(),
                description: formDesc.trim(),
                priority: formPriority,
                category: finalCategory,
                dueDate: formDueDate,
                subtasks: updatedSubtasks,
                completed: allCompleted ? true : t.completed
              }
            : t
        )
      );

      addLogEntry(
        `Updated task '${formTitle.trim()}'`,
        `タスク『${formTitle.trim()}』を更新しました`
      );
    } else {
      // Add mode
      const newSubtasksObj: SubTask[] = formSubtasks.map((text) => ({
        id: `sub-${Date.now()}-${Math.random()}`,
        text,
        completed: false
      }));

      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: formTitle.trim(),
        description: formDesc.trim(),
        priority: formPriority,
        category: finalCategory,
        dueDate: formDueDate,
        subtasks: newSubtasksObj,
        completed: false,
        createdAt: new Date().toISOString()
      };

      setTasks([newTask, ...tasks]);

      addLogEntry(
        `Created task '${formTitle.trim()}'`,
        `タスク『${formTitle.trim()}』を作成しました`
      );
    }

    setShowAddForm(false);
    setEditingTask(null);
  };

  // --- Task Interaction Handlers ---
  const handleToggleTaskComplete = (taskId: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const newCompleted = !t.completed;
          
          // If task toggled completed, mark all subtasks completed. If toggled active, keep subtasks as they are or mark active.
          const updatedSubtasks = t.subtasks.map((st) => ({
            ...st,
            completed: newCompleted ? true : st.completed
          }));

          addLogEntry(
            `${newCompleted ? "Completed" : "Re-activated"} task '${t.title}'`,
            `タスク『${t.title}』を${newCompleted ? "完了" : "未完了"}にしました`
          );

          return {
            ...t,
            completed: newCompleted,
            subtasks: updatedSubtasks
          };
        }
        return t;
      })
    );
  };

  const handleToggleSubtaskComplete = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          
          // If all subtasks are completed, automatically mark the main task as completed
          const allCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);
          
          const targetSubtask = t.subtasks.find((st) => st.id === subtaskId);
          const verb = targetSubtask?.completed ? "Re-activated" : "Completed";
          const verbJa = targetSubtask?.completed ? "未完了に" : "完了に";

          addLogEntry(
            `${verb} subtask '${targetSubtask?.text}' under '${t.title}'`,
            `サブタスク『${targetSubtask?.text}』（親タスク：『${t.title}』）を${verbJa}しました`
          );

          return {
            ...t,
            subtasks: updatedSubtasks,
            completed: allCompleted ? true : t.completed
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId: string, title: string) => {
    if (confirm(t.deleteConfirm)) {
      setTasks(tasks.filter((t) => t.id !== taskId));
      if (focusTaskId === taskId) {
        setFocusTaskId(null);
        setIsTimerRunning(false);
      }
      addLogEntry(`Deleted task '${title}'`, `タスク『${title}』を削除しました`);
    }
  };

  // --- Pomodoro Timer Handlers ---
  const handleStartTimer = (taskId: string) => {
    setFocusTaskId(taskId);
    setIsTimerRunning(true);
    const focusTask = tasks.find((t) => t.id === taskId);
    addLogEntry(
      `Started focus timer for task '${focusTask?.title}'`,
      `タスク『${focusTask?.title}』の集中タイマーを開始しました`
    );
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
    const focusTask = tasks.find((t) => t.id === focusTaskId);
    addLogEntry(
      `Paused focus timer for task '${focusTask?.title}'`,
      `タスク『${focusTask?.title}』の集中タイマーを一時停止しました`
    );
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeRemaining(timerDuration * 60);
  };

  const handleTimerCompletion = () => {
    setCompletedSessions((prev) => prev + 1);
    const focusTask = tasks.find((t) => t.id === focusTaskId);
    
    addLogEntry(
      `Finished a ${timerDuration}-minute focus session on task '${focusTask?.title || "Focus Task"}'`,
      `タスク『${focusTask?.title || "フォーカスタスク"}』で ${timerDuration} 分間の集中セッションを完了しました`
    );

    alert(`${t.focusCompleted}\n\nTask: ${focusTask?.title || ""}`);
  };

  useEffect(() => {
    handleTimerCompletionRef.current = handleTimerCompletion;
  });

  // --- Computed Categories ---
  const uniqueCategories = useMemo(() => {
    const cats = tasks.map((t) => t.category);
    return Array.from(new Set(cats));
  }, [tasks]);

  // --- Filtered and Sorted Tasks ---
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && !task.completed) ||
          (statusFilter === "completed" && task.completed);
        
        const matchesPriority =
          priorityFilter === "all" || task.priority === priorityFilter;

        const matchesCategory =
          categoryFilter === "all" || task.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "dueDate") {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === "priority") {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        return b.createdAt.localeCompare(a.createdAt); // Created At desc
      });
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy]);

  // --- Analytics Computations ---
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Check overdue
    const todayStr = new Date().toISOString().split("T")[0];
    const overdue = tasks.filter(
      (t) => !t.completed && t.dueDate && t.dueDate < todayStr
    ).length;

    return { total, completed, active, rate, overdue };
  }, [tasks]);

  // Breakdown of tasks by category
  const categoryStats = useMemo(() => {
    const record: Record<string, { total: number; completed: number }> = {};
    tasks.forEach((t) => {
      if (!record[t.category]) {
        record[t.category] = { total: 0, completed: 0 };
      }
      record[t.category].total += 1;
      if (t.completed) {
        record[t.category].completed += 1;
      }
    });

    return Object.entries(record).map(([name, val]) => ({
      name,
      total: val.total,
      completed: val.completed,
      pct: Math.round((val.completed / val.total) * 100)
    }));
  }, [tasks]);

  // --- Date Relative Display ---
  const getRelativeDateLabel = (dateStr: string, completed: boolean) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (completed) {
      return { text: dateStr, color: "var(--color-outline)" };
    }

    if (diffDays < 0) {
      return { text: `${t.overdueAlert} (${dateStr})`, color: "var(--color-error)", bg: "rgba(255, 107, 107, 0.15)" };
    }
    if (diffDays === 0) {
      return { text: t.dueTodayAlert, color: "var(--color-amber)", bg: "rgba(255, 180, 0, 0.15)" };
    }
    if (diffDays === 1) {
      return { text: t.dueTomorrowAlert, color: "var(--color-primary)", bg: "rgba(0, 122, 255, 0.1)" };
    }
    return { text: t.dueDaysAlert(diffDays), color: "var(--color-on-surface-variant)", bg: "transparent" };
  };

  const getPriorityBadgeColor = (p: Task["priority"]) => {
    switch (p) {
      case "critical":
        return { text: t.critical, color: "var(--color-on-error-container)", bg: "var(--color-error-container)" };
      case "high":
        return { text: t.high, color: "var(--color-on-error-container)", bg: "rgba(255, 107, 107, 0.25)" };
      case "medium":
        return { text: t.medium, color: "var(--color-on-warning-container, #8f6a00)", bg: "var(--color-warning-container, #ffecb3)" };
      default:
        return { text: t.low, color: "var(--color-on-secondary-container)", bg: "var(--color-secondary-container)" };
    }
  };

  // --- Category Color Dot ---
  const getCategoryColor = (catName: string) => {
    const hash = catName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      "#4285F4", // blue
      "#34A853", // green
      "#FBBC05", // yellow
      "#EA4335", // red
      "#A142F4", // purple
      "#24C1E0", // cyan
      "#F43F5E", // rose
      "#10B981"  // emerald
    ];
    return colors[hash % colors.length];
  };

  // For focus progress circle representation
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const activeFocusTaskObj = tasks.find((t) => t.id === focusTaskId);

  return (
    <div className="glass-panel framework-interactive" style={{ padding: "1.5rem", borderRadius: "1.2rem", marginTop: "2rem" }}>
      <style>{`
        .todo-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 900px) {
          .todo-grid {
            grid-template-columns: 1.7fr 1fr;
          }
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 600px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .stat-box {
          padding: 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-outline-variant);
          background: color-mix(in srgb, var(--color-surface-container) 40%, transparent);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--color-primary);
          margin-top: 0.25rem;
        }
        .stat-label {
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--color-on-surface-variant);
          text-transform: uppercase;
        }
        .subtasks-list {
          margin-top: 0.75rem;
          padding-left: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .subtask-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.84rem;
        }
        .task-card {
          margin-bottom: 1rem;
          padding: 1.2rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-outline-variant);
          background: color-mix(in srgb, var(--color-surface-container-high) 60%, transparent);
          transition: all 0.2s ease;
          position: relative;
        }
        .task-card:hover {
          border-color: var(--color-primary);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        .task-card.is-completed {
          opacity: 0.65;
        }
        .task-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .task-checkbox {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: var(--radius-xs, 4px);
          border: 2px solid var(--color-outline);
          appearance: none;
          cursor: pointer;
          display: grid;
          place-content: center;
          transition: all 0.2s ease;
          margin-top: 0.2rem;
        }
        .task-checkbox:checked {
          background: var(--color-primary);
          border-color: var(--color-primary);
        }
        .task-checkbox:checked::before {
          content: "✓";
          color: var(--color-on-primary);
          font-size: 0.8rem;
          font-weight: bold;
        }
        .progress-bar-container {
          width: 100%;
          height: 6px;
          background: var(--color-surface-container-highest);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-top: 0.75rem;
        }
        .progress-bar-fill {
          height: 100%;
          background: var(--color-primary);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .timer-circle-wrap {
          position: relative;
          width: 180px;
          height: 180px;
          margin: 1.5rem auto;
          display: grid;
          place-content: center;
        }
        .timer-svg {
          transform: rotate(-90deg);
          position: absolute;
          top: 0;
          left: 0;
        }
        .timer-display {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--color-primary);
          z-index: 2;
          font-family: monospace;
        }
        .form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: grid;
          place-content: center;
          z-index: 1000;
          padding: 1.5rem;
        }
        .form-container {
          width: 100%;
          max-width: 520px;
          background: var(--color-surface);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }
        .activity-feed {
          max-height: 250px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding-right: 0.25rem;
        }
        .activity-item {
          font-size: 0.8rem;
          padding: 0.5rem;
          border-left: 3px solid var(--color-primary);
          background: color-mix(in srgb, var(--color-surface-container) 30%, transparent);
          border-radius: 0 var(--radius-xs) var(--radius-xs) 0;
        }
      `}</style>

      <div className="tool-surface-header">
        <div>
          <span className="tool-badge">
            {isJa ? "生産性ツール" : "Productivity App"}
          </span>
          <h2 className="tool-title">{t.title}</h2>
          <p className="tool-copy" style={{ margin: "0.25rem 0 0 0", fontSize: "0.86rem" }}>{t.subtitle}</p>
        </div>

        <div className="tool-tab-list" role="tablist">
          <button 
            type="button" 
            className={`tool-tab-button ${activeTab === "tasks" ? "active" : ""}`} 
            onClick={() => setActiveTab("tasks")}
          >
            {t.tabTasks}
          </button>
          <button 
            type="button" 
            className={`tool-tab-button ${activeTab === "analytics" ? "active" : ""}`} 
            onClick={() => setActiveTab("analytics")}
          >
            {t.tabAnalytics}
          </button>
        </div>
      </div>

      {/* --- STATISTICS GRID SUMMARY --- */}
      <div className="stats-grid">
        <div className="stat-box">
          <span className="stat-label">{t.statsCompleted}</span>
          <span className="stat-value">{stats.rate}%</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">{t.statsActive}</span>
          <span className="stat-value">{stats.active}</span>
        </div>
        <div className="stat-box" style={{ borderColor: stats.overdue > 0 ? "rgba(255, 107, 107, 0.4)" : "var(--color-outline-variant)" }}>
          <span className="stat-label" style={{ color: stats.overdue > 0 ? "var(--color-error)" : "var(--color-on-surface-variant)" }}>{t.statsOverdue}</span>
          <span className="stat-value" style={{ color: stats.overdue > 0 ? "var(--color-error)" : "var(--color-primary)" }}>{stats.overdue}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">{t.statsFocusSessions}</span>
          <span className="stat-value">{completedSessions}</span>
        </div>
      </div>

      {activeTab === "tasks" && (
        <div className="todo-grid">
          
          {/* --- LEFT COLUMN: TASK LIST & FILTERS --- */}
          <div>
            {/* Filter Bar */}
            <div className="glass-panel" style={{ padding: "0.85rem", borderRadius: "0.8rem", marginBottom: "1.2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.45rem 0.75rem",
                    borderRadius: "0.4rem",
                    border: "1px solid var(--color-outline-variant)",
                    background: "var(--color-surface)",
                    color: "var(--color-on-surface)",
                    fontSize: "0.88rem"
                  }}
                />
                
                <button
                  type="button"
                  onClick={handleOpenAddForm}
                  style={{
                    background: "var(--color-primary)",
                    color: "var(--color-on-primary)",
                    border: "0",
                    padding: "0.45rem 1rem",
                    borderRadius: "0.4rem",
                    fontWeight: "800",
                    fontSize: "0.88rem",
                    cursor: "pointer"
                  }}
                >
                  + {t.addTask}
                </button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", fontSize: "0.8rem" }}>
                {/* Status Filter */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <span>{t.filterStatus}:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "completed")}
                    style={{ padding: "0.25rem", borderRadius: "0.25rem", border: "1px solid var(--color-outline-variant)", background: "var(--color-surface)", color: "var(--color-on-surface)" }}
                  >
                    <option value="all">{t.allLabel}</option>
                    <option value="active">{t.activeLabel}</option>
                    <option value="completed">{t.completedLabel}</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <span>{t.filterPriority}:</span>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as "all" | "critical" | "high" | "medium" | "low")}
                    style={{ padding: "0.25rem", borderRadius: "0.25rem", border: "1px solid var(--color-outline-variant)", background: "var(--color-surface)", color: "var(--color-on-surface)" }}
                  >
                    <option value="all">{t.allLabel}</option>
                    <option value="critical">{t.critical}</option>
                    <option value="high">{t.high}</option>
                    <option value="medium">{t.medium}</option>
                    <option value="low">{t.low}</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <span>{t.filterCategory}:</span>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{ padding: "0.25rem", borderRadius: "0.25rem", border: "1px solid var(--color-outline-variant)", background: "var(--color-surface)", color: "var(--color-on-surface)" }}
                  >
                    <option value="all">{t.allLabel}</option>
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginLeft: "auto" }}>
                  <span>{t.sortBy}:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "dueDate" | "priority" | "createdAt")}
                    style={{ padding: "0.25rem", borderRadius: "0.25rem", border: "1px solid var(--color-outline-variant)", background: "var(--color-surface)", color: "var(--color-on-surface)" }}
                  >
                    <option value="dueDate">{t.sortDueDate}</option>
                    <option value="priority">{t.sortPriority}</option>
                    <option value="createdAt">{t.sortCreated}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Task Cards List */}
            {filteredTasks.length === 0 ? (
              <div className="glass-panel" style={{ padding: "3rem", borderRadius: "0.8rem", textAlign: "center" }}>
                <p style={{ color: "var(--color-on-surface-variant)", fontSize: "1rem", fontWeight: "700" }}>{t.noTasks}</p>
                <p style={{ color: "var(--color-outline)", fontSize: "0.85rem", marginTop: "0.25rem" }}>{t.createOne}</p>
              </div>
            ) : (
              <div>
                {filteredTasks.map((task) => {
                  const dateLabel = getRelativeDateLabel(task.dueDate, task.completed);
                  const prioBadge = getPriorityBadgeColor(task.priority);
                  const catColor = getCategoryColor(task.category);

                  const totalSub = task.subtasks.length;
                  const compSub = task.subtasks.filter((s) => s.completed).length;
                  const pctSub = totalSub > 0 ? Math.round((compSub / totalSub) * 100) : 0;

                  return (
                    <div 
                      key={task.id} 
                      className={`task-card ${task.completed ? "is-completed" : ""}`}
                    >
                      <div className="task-header">
                        <input
                          type="checkbox"
                          className="task-checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTaskComplete(task.id)}
                          aria-label={task.completed ? "Mark task active" : "Mark task completed"}
                        />

                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.45rem", marginBottom: "0.35rem" }}>
                            {/* Category Label */}
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", fontWeight: "800", color: "var(--color-on-surface-variant)" }}>
                              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: catColor, display: "inline-block" }} />
                              {task.category}
                            </span>
                            
                            {/* Priority Badge */}
                            <span style={{ fontSize: "0.7rem", fontWeight: "850", padding: "0.15rem 0.45rem", borderRadius: "4px", color: prioBadge.color, background: prioBadge.bg, textTransform: "uppercase" }}>
                              {prioBadge.text}
                            </span>

                            {/* Due Date Label */}
                            {dateLabel && (
                              <span style={{ fontSize: "0.7rem", fontWeight: "750", padding: "0.15rem 0.45rem", borderRadius: "4px", color: dateLabel.color, background: dateLabel.bg }}>
                                {dateLabel.text}
                              </span>
                            )}
                          </div>

                          <h3 style={{ 
                            fontSize: "1.05rem", 
                            fontWeight: "750", 
                            color: "var(--color-on-surface)",
                            textDecoration: task.completed ? "line-through" : "none",
                            lineHeight: "1.3"
                          }}>
                            {task.title}
                          </h3>

                          {task.description && (
                            <p style={{ fontSize: "0.85rem", color: "var(--color-on-surface-variant)", marginTop: "0.35rem", lineHeight: "1.5" }}>
                              {task.description}
                            </p>
                          )}

                          {/* Subtask Checklists */}
                          {task.subtasks.length > 0 && (
                            <div style={{ marginTop: "0.75rem" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", fontWeight: "700", color: "var(--color-outline)" }}>
                                <span>{t.subtasksLabel} ({compSub}/{totalSub})</span>
                                <span>{pctSub}%</span>
                              </div>
                              <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${pctSub}%`, background: task.completed ? "var(--color-outline)" : "var(--color-primary)" }} />
                              </div>
                              
                              <div className="subtasks-list">
                                {task.subtasks.map((st) => (
                                  <label key={st.id} className="subtask-item" style={{ cursor: "pointer", color: st.completed ? "var(--color-outline)" : "var(--color-on-surface)" }}>
                                    <input
                                      type="checkbox"
                                      checked={st.completed}
                                      onChange={() => handleToggleSubtaskComplete(task.id, st.id)}
                                      style={{ cursor: "pointer", accentColor: "var(--color-primary)" }}
                                    />
                                    <span style={{ textDecoration: st.completed ? "line-through" : "none" }}>{st.text}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Task Action Bar */}
                          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", borderTop: "1px solid var(--color-outline-variant)", paddingTop: "0.65rem", justifyContent: "flex-end" }}>
                            {!task.completed && (
                              <button
                                type="button"
                                onClick={() => handleStartTimer(task.id)}
                                style={{
                                  background: "transparent",
                                  border: "0",
                                  color: "var(--color-primary)",
                                  fontSize: "0.78rem",
                                  fontWeight: "800",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.25rem"
                                }}
                              >
                                ⏱ {t.focusStart}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenEditForm(task)}
                              style={{
                                background: "transparent",
                                border: "0",
                                color: "var(--color-outline)",
                                fontSize: "0.78rem",
                                fontWeight: "800",
                                cursor: "pointer"
                              }}
                            >
                              ✎ {isJa ? "編集" : "Edit"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteTask(task.id, task.title)}
                              style={{
                                background: "transparent",
                                border: "0",
                                color: "var(--color-error)",
                                fontSize: "0.78rem",
                                fontWeight: "800",
                                cursor: "pointer"
                              }}
                            >
                              🗑 {isJa ? "削除" : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: POMODORO FOCUS TIMER --- */}
          <div>
            <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "0.8rem", textAlign: "center", position: "sticky", top: "100px" }}>
              <span className="tool-badge" style={{ background: "var(--color-primary-container)", color: "var(--color-on-primary-container)" }}>
                {t.focusMode}
              </span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginTop: "0.25rem", color: "var(--color-on-surface)" }}>{t.focusTimer}</h3>
              
              {/* Duration presets */}
              <div style={{ display: "flex", justifyContent: "center", gap: "0.45rem", marginTop: "0.75rem" }}>
                {[15, 25, 45].map((d) => (
                  <button
                    key={d}
                    type="button"
                    disabled={isTimerRunning}
                    onClick={() => {
                      setTimerDuration(d);
                      setTimeRemaining(d * 60);
                    }}
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      border: "1px solid var(--color-outline-variant)",
                      background: timerDuration === d ? "var(--color-primary)" : "transparent",
                      color: timerDuration === d ? "var(--color-on-primary)" : "var(--color-on-surface)",
                      fontSize: "0.74rem",
                      fontWeight: "750",
                      cursor: isTimerRunning ? "not-allowed" : "pointer",
                      opacity: isTimerRunning ? 0.5 : 1
                    }}
                  >
                    {d} Min
                  </button>
                ))}
              </div>

              {/* Circular Timer Visual representation */}
              <div className="timer-circle-wrap">
                {/* SVG Ring */}
                <svg className="timer-svg" width="180" height="180">
                  <circle
                    cx="90"
                    cy="90"
                    r="82"
                    stroke="var(--color-outline-variant)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r="82"
                    stroke="var(--color-primary)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 82}
                    strokeDashoffset={
                      (2 * Math.PI * 82) * (1 - timeRemaining / (timerDuration * 60))
                    }
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <div className="timer-display">{formatTime(timeRemaining)}</div>
              </div>

              {/* Timer Controls */}
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
                {isTimerRunning ? (
                  <button
                    type="button"
                    onClick={handlePauseTimer}
                    style={{
                      background: "var(--color-error)",
                      color: "var(--color-on-error)",
                      border: "0",
                      padding: "0.45rem 1rem",
                      borderRadius: "0.4rem",
                      fontWeight: "800",
                      cursor: "pointer",
                      fontSize: "0.85rem"
                    }}
                  >
                    ⏸ {t.focusPause}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!focusTaskId}
                    onClick={() => setIsTimerRunning(true)}
                    style={{
                      background: focusTaskId ? "var(--color-primary)" : "var(--color-outline-variant)",
                      color: focusTaskId ? "var(--color-on-primary)" : "var(--color-outline)",
                      border: "0",
                      padding: "0.45rem 1rem",
                      borderRadius: "0.4rem",
                      fontWeight: "800",
                      cursor: focusTaskId ? "pointer" : "not-allowed",
                      fontSize: "0.85rem"
                    }}
                  >
                    ▶ {focusTaskId && activeFocusTaskObj ? t.focusResume : t.focusStart}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetTimer}
                  style={{
                    background: "transparent",
                    color: "var(--color-on-surface)",
                    border: "1px solid var(--color-outline-variant)",
                    padding: "0.45rem 1rem",
                    borderRadius: "0.4rem",
                    fontWeight: "800",
                    cursor: "pointer",
                    fontSize: "0.85rem"
                  }}
                >
                  ↺ {t.focusReset}
                </button>
              </div>

              {/* Task focused description */}
              <div style={{ marginTop: "1.25rem", borderTop: "1px solid var(--color-outline-variant)", paddingTop: "0.85rem" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--color-outline)", fontWeight: "750", textTransform: "uppercase" }}>
                  {t.activeFocusTask}
                </span>
                
                {focusTaskId && activeFocusTaskObj ? (
                  <div style={{ marginTop: "0.25rem" }}>
                    <p style={{ fontSize: "0.9rem", fontWeight: "800", color: "var(--color-primary)" }}>{activeFocusTaskObj.title}</p>
                    <p style={{ fontSize: "0.78rem", color: "var(--color-on-surface-variant)", marginTop: "0.15rem" }}>{activeFocusTaskObj.category}</p>
                  </div>
                ) : (
                  <p style={{ fontSize: "0.82rem", color: "var(--color-outline)", marginTop: "0.25rem", fontStyle: "italic" }}>
                    {t.selectFocusTask}
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* --- ANALYTICS TAB CONTENT --- */}
      {activeTab === "analytics" && (
        <div className="todo-grid">
          
          {/* Productivity Stats */}
          <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "0.8rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--color-on-surface)", marginBottom: "1rem" }}>
              {t.categoryDistribution}
            </h3>
            
            {categoryStats.length === 0 ? (
              <p style={{ color: "var(--color-outline)", fontStyle: "italic", fontSize: "0.85rem" }}>
                {isJa ? "データがありません。まずタスクを作成してください。" : "No tasks categories found. Create a task first."}
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {categoryStats.map((cat) => {
                  const catColor = getCategoryColor(cat.name);
                  return (
                    <div key={cat.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", fontWeight: "750", marginBottom: "0.25rem" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--color-on-surface)" }}>
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: catColor }} />
                          {cat.name}
                        </span>
                        <span style={{ color: "var(--color-on-surface-variant)" }}>
                          {cat.completed} / {cat.total} ({cat.pct}%)
                        </span>
                      </div>
                      
                      <div style={{ width: "100%", height: "8px", background: "var(--color-surface-container-highest)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                        <div style={{ width: `${cat.pct}%`, height: "100%", background: catColor, borderRadius: "var(--radius-full)" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Activity Logs */}
          <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "0.8rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--color-on-surface)", marginBottom: "1rem" }}>
              {t.recentActivity}
            </h3>
            
            <div className="activity-feed">
              {activityLog.length === 0 ? (
                <p style={{ color: "var(--color-outline)", fontStyle: "italic", fontSize: "0.82rem" }}>
                  {isJa ? "アクティビティがありません" : "No recent activity recorded."}
                </p>
              ) : (
                activityLog.map((log) => (
                  <div key={log.id} className="activity-item">
                    <p style={{ color: "var(--color-on-surface)", lineHeight: "1.4" }}>
                      {isJa ? log.actionJa : log.actionEn}
                    </p>
                    <span style={{ fontSize: "0.68rem", color: "var(--color-outline)", display: "block", marginTop: "0.15rem" }}>
                      {new Date(log.timestamp).toLocaleTimeString(isJa ? "ja-JP" : "en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* --- ADD/EDIT MODAL FORM OVERLAY --- */}
      {showAddForm && (
        <div className="form-overlay">
          <form className="form-container" onSubmit={handleSaveTask}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "850", color: "var(--color-primary)", marginBottom: "1rem" }}>
              {editingTask ? t.editTask : t.addTask}
            </h3>
            
            {/* Title */}
            <div style={{ marginBottom: "0.85rem" }}>
              <label htmlFor="form-title" style={{ display: "block", fontSize: "0.78rem", fontWeight: "750", color: "var(--color-on-surface-variant)", marginBottom: "0.25rem", textTransform: "uppercase" }}>
                {t.taskTitle} <span style={{ color: "var(--color-error)" }}>*</span>
              </label>
              <input
                id="form-title"
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder={t.taskTitlePlaceholder}
                style={{
                  width: "100%",
                  padding: "0.45rem 0.65rem",
                  borderRadius: "0.3rem",
                  border: "1px solid var(--color-outline-variant)",
                  background: "var(--color-surface)",
                  color: "var(--color-on-surface)",
                  fontSize: "0.88rem"
                }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: "0.85rem" }}>
              <label htmlFor="form-desc" style={{ display: "block", fontSize: "0.78rem", fontWeight: "750", color: "var(--color-on-surface-variant)", marginBottom: "0.25rem", textTransform: "uppercase" }}>
                {t.taskDesc}
              </label>
              <textarea
                id="form-desc"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder={t.taskDescPlaceholder}
                rows={2}
                style={{
                  width: "100%",
                  padding: "0.45rem 0.65rem",
                  borderRadius: "0.3rem",
                  border: "1px solid var(--color-outline-variant)",
                  background: "var(--color-surface)",
                  color: "var(--color-on-surface)",
                  fontSize: "0.88rem",
                  resize: "vertical"
                }}
              />
            </div>

            {/* Priority & Category Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.85rem" }}>
              <div>
                <label htmlFor="form-priority" style={{ display: "block", fontSize: "0.78rem", fontWeight: "750", color: "var(--color-on-surface-variant)", marginBottom: "0.25rem", textTransform: "uppercase" }}>
                  {t.taskPriority}
                </label>
                <select
                  id="form-priority"
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value as "critical" | "high" | "medium" | "low")}
                  style={{
                    width: "100%",
                    padding: "0.45rem",
                    borderRadius: "0.3rem",
                    border: "1px solid var(--color-outline-variant)",
                    background: "var(--color-surface)",
                    color: "var(--color-on-surface)",
                    fontSize: "0.88rem"
                  }}
                >
                  <option value="critical">{t.critical}</option>
                  <option value="high">{t.high}</option>
                  <option value="medium">{t.medium}</option>
                  <option value="low">{t.low}</option>
                </select>
              </div>

              <div>
                <label htmlFor="form-category" style={{ display: "block", fontSize: "0.78rem", fontWeight: "750", color: "var(--color-on-surface-variant)", marginBottom: "0.25rem", textTransform: "uppercase" }}>
                  {t.taskCategory}
                </label>
                <select
                  id="form-category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.45rem",
                    borderRadius: "0.3rem",
                    border: "1px solid var(--color-outline-variant)",
                    background: "var(--color-surface)",
                    color: "var(--color-on-surface)",
                    fontSize: "0.88rem"
                  }}
                >
                  <option value={isJa ? "仕事" : "Work"}>{isJa ? "仕事" : "Work"}</option>
                  <option value={isJa ? "個人" : "Personal"}>{isJa ? "個人" : "Personal"}</option>
                  <option value={isJa ? "教育" : "Education"}>{isJa ? "教育" : "Education"}</option>
                  <option value={isJa ? "健康" : "Health"}>{isJa ? "健康" : "Health"}</option>
                  <option value={isJa ? "開発" : "Dev"}>{isJa ? "開発" : "Dev"}</option>
                </select>
              </div>
            </div>

            {/* Custom Category & Due Date */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.85rem" }}>
              <div>
                <label htmlFor="form-custom-category" style={{ display: "block", fontSize: "0.78rem", fontWeight: "750", color: "var(--color-on-surface-variant)", marginBottom: "0.25rem", textTransform: "uppercase" }}>
                  {t.customCategory}
                </label>
                <input
                  id="form-custom-category"
                  type="text"
                  value={formCustomCategory}
                  onChange={(e) => setFormCustomCategory(e.target.value)}
                  placeholder="e.g. Design"
                  style={{
                    width: "100%",
                    padding: "0.45rem 0.65rem",
                    borderRadius: "0.3rem",
                    border: "1px solid var(--color-outline-variant)",
                    background: "var(--color-surface)",
                    color: "var(--color-on-surface)",
                    fontSize: "0.88rem"
                  }}
                />
              </div>

              <div>
                <label htmlFor="form-due-date" style={{ display: "block", fontSize: "0.78rem", fontWeight: "750", color: "var(--color-on-surface-variant)", marginBottom: "0.25rem", textTransform: "uppercase" }}>
                  {t.dueDateLabel}
                </label>
                <input
                  id="form-due-date"
                  type="date"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.4rem 0.65rem",
                    borderRadius: "0.3rem",
                    border: "1px solid var(--color-outline-variant)",
                    background: "var(--color-surface)",
                    color: "var(--color-on-surface)",
                    fontSize: "0.88rem"
                  }}
                />
              </div>
            </div>

            {/* Subtasks Builder */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label htmlFor="form-subtask-input" style={{ display: "block", fontSize: "0.78rem", fontWeight: "750", color: "var(--color-on-surface-variant)", marginBottom: "0.25rem", textTransform: "uppercase" }}>
                {t.subtasksLabel}
              </label>
              
              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem" }}>
                <input
                  id="form-subtask-input"
                  type="text"
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  placeholder={t.subtaskPlaceholder}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSubtaskInput();
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: "0.4rem 0.65rem",
                    borderRadius: "0.3rem",
                    border: "1px solid var(--color-outline-variant)",
                    background: "var(--color-surface)",
                    color: "var(--color-on-surface)",
                    fontSize: "0.84rem"
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSubtaskInput}
                  style={{
                    background: "var(--color-secondary-container)",
                    color: "var(--color-on-secondary-container)",
                    border: "1px solid var(--color-outline-variant)",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "0.3rem",
                    fontWeight: "800",
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  +
                </button>
              </div>

              {formSubtasks.length > 0 && (
                <div style={{ 
                  maxHeight: "100px", 
                  overflowY: "auto", 
                  border: "1px solid var(--color-outline-variant)", 
                  borderRadius: "4px", 
                  padding: "0.45rem", 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "0.25rem",
                  background: "color-mix(in srgb, var(--color-surface-container) 20%, transparent)"
                }}>
                  {formSubtasks.map((text, idx) => (
                    <div key={`${text}-${idx}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "var(--color-on-surface)" }}>
                      <span>• {text}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFormSubtask(idx)}
                        style={{
                          background: "transparent",
                          border: "0",
                          color: "var(--color-error)",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: "800"
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{
                  background: "transparent",
                  color: "var(--color-on-surface)",
                  border: "1px solid var(--color-outline-variant)",
                  padding: "0.45rem 1rem",
                  borderRadius: "0.4rem",
                  fontWeight: "800",
                  cursor: "pointer",
                  fontSize: "0.88rem"
                }}
              >
                {t.cancel}
              </button>
              
              <button
                type="submit"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-on-primary)",
                  border: "0",
                  padding: "0.45rem 1.25rem",
                  borderRadius: "0.4rem",
                  fontWeight: "800",
                  cursor: "pointer",
                  fontSize: "0.88rem"
                }}
              >
                {t.save}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
