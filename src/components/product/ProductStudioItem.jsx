import React, { useEffect, useRef, useState } from "react";

import { setCreatedAt } from "../../constants/config";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RxDragHandleDots1 } from "react-icons/rx";

import { useNavigate } from "react-router-dom";

import { SProductStudioItem } from "./ProductStudioItem.styled";
import ProductService from "../../services/ProductService";
import swal from "sweetalert";

const ProductStudioItem = ({
  data,
  refetch,
  option,
  sorted,
  onClick,
  onDetail,
}) => {
  const navigation = useNavigate();

  const onClickOption = (id) => {
    if (id === "edit") {
      onDetail(data);
    }

    if (id === "copy") {
      swal({
        title: "상품을 복제하시겠습니까?",
        text: "",
        buttons: true,
        icon: "info",
      }).then((willDelete) => {
        if (willDelete) {
          ProductService.cloneStudio(data?.id).then(() => {
            refetch();
          });
        }
      });
    }

    if (id === "delete") {
      swal({
        title: "상품을 삭제하시겠습니까?",
        text: "",
        buttons: true,
        icon: "warning",
      }).then((willDelete) => {
        if (willDelete) {
          ProductService.deleteStudio(data?.id).then((res) => {
            if (res.status === 200) {
              refetch();
            } else {
              swal({
                title: "",
                text: res.data?.message || "스튜디오를 삭제할 수 없습니다.",
                icon: "warning",
              });
            }
          });
        }
      });
    }

    if (id === "detail") {
      onClickGoDetail();
    }
  };

  const onClickGoDetail = () => {
    if (onClick) {
      onClick(data);
    } else {
      if (data?.lessonType === "Special") {
        navigation(`/pages/product/studio/${data?.studiosId}/${data?.id}`);
      } else {
        navigation(`/pages/product/studio/${data?.id}`);
      }
    }
  };

  return (
    <SProductStudioItem className="sorted-product-shell">
      <div className="product-shell-item-image-container">
        <img
          className="product-shell-item-images"
          src={data?.images?.[0]?.url || ""}
          alt={data?.title}
          onError={(e) => {
            e.target.src = "/img/noImg.png";
          }}
        />

        {sorted && <ProductShellDragButton />}

        {option && <ProductShellItemOption onClickOption={onClickOption} />}
      </div>

      <div className="product-shell-item-contents-container">
        <p className="product-shell-item-createdAt">
          {setCreatedAt(data?.createdAt || "", "-")}
        </p>
        <p className="product-shell-item-title" onClick={onClickGoDetail}>
          {data?.title || ""}
        </p>
        <div
          className={`product-shell-item-isShow ${
            data?.isShow ? "point-text" : "disabled-text"
          }`}
        >
          {data?.isShow ? "게시중" : "숨김"}
        </div>
      </div>
    </SProductStudioItem>
  );
};

const Option = [
  { id: "edit", title: "장소 수정" },
  { id: "copy", title: "장소 복제" },
  { id: "delete", title: "장소 삭제" },
  { id: "detail", title: "프로그램 목록" },
];

const ProductShellDragButton = () => {
  return (
    <button className="product-shell-item-drag-button">
      <RxDragHandleDots1 />
    </button>
  );
};

const ProductShellItemOption = ({ onClickOption }) => {
  const optionRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closeOption = (e) => {
      if (isOpen && !optionRef.current?.contains(e.target)) setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener("click", closeOption);
    }

    return () => window.removeEventListener("click", closeOption);
  }, [isOpen]);

  const onClickToggleOption = () => {
    setIsOpen((prev) => !prev);
  };

  const onClickOptionByClose = (id) => {
    onClickOption(id);
    setIsOpen(false);
  };

  return (
    <div className="product-shell-item-option-container" ref={optionRef}>
      <button
        className="product-shell-item-option-button"
        onClick={onClickToggleOption}
      >
        <BsThreeDotsVertical />
      </button>

      <ul className={`product-shell-item-option ${isOpen ? "active" : ""}`}>
        {Option?.map((option) => (
          <li
            key={option?.id}
            className="option-item"
            onClick={() => onClickOptionByClose(option?.id)}
          >
            {option?.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductStudioItem;
